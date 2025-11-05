package DATAJPA.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@caresync.com}")
    private String fromEmail;

    public void sendOtpEmail(String toEmail, String otpCode) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("CareSync - Your OTP Code");
            message.setText("Your OTP code is: " + otpCode + "\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.");

            mailSender.send(message);
            log.info("OTP email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send OTP email: {}", e.getMessage());
            // Don't throw exception - allow login to continue even if email fails
        }
    }

    public void sendAppointmentConfirmation(String toEmail, String patientName, String doctorName,
                                           String appointmentDate, String appointmentTime) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("CareSync - Appointment Confirmation");
            message.setText(String.format(
                "Dear %s,\n\n" +
                "Your appointment has been confirmed:\n\n" +
                "Doctor: %s\n" +
                "Date: %s\n" +
                "Time: %s\n\n" +
                "Please arrive 15 minutes before your appointment time.\n\n" +
                "Thank you,\nCareSync Team",
                patientName, doctorName, appointmentDate, appointmentTime
            ));

            mailSender.send(message);
            log.info("Appointment confirmation email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send appointment confirmation email: {}", e.getMessage());
        }
    }

    public void sendBillNotification(String toEmail, String patientName, String billNumber, String amount) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("CareSync - Bill Generated");
            message.setText(String.format(
                "Dear %s,\n\n" +
                "A new bill has been generated for you:\n\n" +
                "Bill Number: %s\n" +
                "Amount: ₹%s\n\n" +
                "Please visit our billing counter for payment.\n\n" +
                "Thank you,\nCareSync Team",
                patientName, billNumber, amount
            ));

            mailSender.send(message);
            log.info("Bill notification email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send bill notification email: {}", e.getMessage());
        }
    }
}

