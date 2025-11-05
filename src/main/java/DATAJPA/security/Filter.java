package DATAJPA.security;

import DATAJPA.Entity.User;
import DATAJPA.Exception.InvalidTokenException;
import DATAJPA.Repository.Userrepositary;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@Slf4j
@RequiredArgsConstructor
public class Filter extends OncePerRequestFilter {
    private final Userrepositary userrepositary;
    private final Auth_util authUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws java.io.IOException, ServletException {
        String authHeader = request.getHeader("Authorization");
        log.info("Authorization Header for {}: {}", request.getRequestURI(), authHeader);

        // If no header or doesn't start with Bearer, continue the chain
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extract token safely
        String token = authHeader.substring(7).trim(); // remove "Bearer " prefix
        if (token.isEmpty()) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String username = authUtil.extractUsername(token);
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                User user = userrepositary.findByUsername(username).orElse(null);
                if (user != null) {
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception e) {
            log.warn("Failed to parse/validate token: {}", e.getMessage());
            // don't set authentication; proceed as anonymous
        }

        // Continue filter chain once
        filterChain.doFilter(request, response);
    }
}
