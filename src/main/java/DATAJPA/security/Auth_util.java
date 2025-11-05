package DATAJPA.security;

import DATAJPA.Entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class Auth_util {
    @Value("${jwt.secretKey:mySecretKeyForJWTTokenGenerationMustBeLongerThan256Bits}")
    private String jwtsecretKey;

    private SecretKey secretKey() {
        return Keys.hmacShaKeyFor(jwtsecretKey.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(User user) {
        return Jwts.builder()
                .subject(user.getUsername())
                .claim("userId", user.getId().toString())
                .signWith(secretKey())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60*24)) // 1 day
                .compact();
    }

    public String extractUsername(String token) {
        Claims claims = Jwts.parser().verifyWith(secretKey()).
                build().parseClaimsJws(token).
                getPayload();
        return claims.getSubject();

    }
}
