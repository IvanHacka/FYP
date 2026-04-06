package org.example.jobboard.service;


import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender javaMailSender;
    public void sendInactiveWarning(String receiver, String userName, int inactivePeriod){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(receiver);
        message.setSubject("Account Inactive Warning"+userName);
        message.setText(String.format(
            "Hello %s,\n\n" +
            "We noticed you haven't logged in for %d days.\n\n" +
            "Your account will be reviewed for deactivation if you remain inactive for 10 more days.\n\n" +
            "Please log in to keep your account active.\n\n" +
            "Best regards,\n" +
            "Come Job",
            userName, inactivePeriod
        ));

        javaMailSender.send(message);
    }
    public void sendAccountReview(String receiver, String userName){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(receiver);
        message.setSubject("Account Inactive Warning"+userName);
        message.setText(String.format(
            "Hello %s,\n\n" +
            "Your account has been inactive for 40 days.\n\n" +
            "Your account is being review for further action.\n\n" +
            "Please log in immediately to keep your account from suspension.\n\n" +
            "Please do not hesitate to contact us if you have any questions.\n\n" +
            "Best regards,\n" +
            "Come Job",
            userName
        ));

        javaMailSender.send(message);
    }
}
