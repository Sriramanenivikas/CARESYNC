package DATAJPA.Service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class SmsService {

    @Value("${sms.api.key:}")
    private String smsApiKey;

    @Value("${sms.api.url:}")
    private String smsApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendOtpSms(String mobile, String otpCode) {
        try {
            // This is a placeholder for SMS integration
            // You can integrate with Fast2SMS, Twilio, or other SMS providers
            String message = "Your CareSync OTP is: " + otpCode + ". Valid for 10 minutes.";

            log.info("SMS OTP would be sent to: {} with code: {}", mobile, otpCode);

            // Uncomment and configure for actual SMS sending
            // if (smsApiKey != null && !smsApiKey.isEmpty()) {
            //     String url = String.format("%s?authorization=%s&message=%s&numbers=%s",
            //             smsApiUrl, smsApiKey, message, mobile);
            //     restTemplate.getForObject(url, String.class);
            // }

        } catch (Exception e) {
            log.error("Failed to send OTP SMS: {}", e.getMessage());
        }
    }

    public void sendAppointmentReminder(String mobile, String patientName, String appointmentTime) {
        try {
            String message = String.format("Dear %s, reminder for your appointment at %s. -CareSync",
                    patientName, appointmentTime);
            log.info("Appointment reminder SMS would be sent to: {}", mobile);
        } catch (Exception e) {
            log.error("Failed to send appointment reminder SMS: {}", e.getMessage());
        }
    }
}

