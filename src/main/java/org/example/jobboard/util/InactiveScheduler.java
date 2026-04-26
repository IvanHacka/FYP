package org.example.jobboard.util;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.jobboard.model.User;
import org.example.jobboard.repo.UserRepo;
import org.example.jobboard.service.EmailService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class InactiveScheduler {
    private final UserRepo userRepo;
    private final EmailService emailService;

//    @Scheduled(cron = "0 0 2 * * *")
    @Scheduled(cron = "*/30 * * * * *")
    public void checkInactiveUsers() {
        // Use log to see timestamp
        log.info("Checking inactive users...");
        LocalDateTime thirtyDays = LocalDateTime.now().minusDays(30);
        LocalDateTime fourtyDays = LocalDateTime.now().minusDays(40);

        List<User> thirtyDaysUsers = userRepo.findUsersInactiveBetween30And40(thirtyDays, fourtyDays);

        for(User user : thirtyDaysUsers) {
            if(!Boolean.TRUE.equals(user.getWarningEmailSent())){
                try{
                    emailService.sendInactiveWarning(user.getEmail(), user.getFullName(), 30);
                    user.setWarningEmailSent(true);
                    userRepo.save(user);
                    log.info("Successfully sent 30 days warning email to: {}", user.getEmail());
                }
                catch (Exception e){
                    log.error("Error sending 30 days warning email to: {}", user.getEmail());
                }

            }
        }
        List<User> fourtyDaysUsers = userRepo.findUsersInactiveOver40(fourtyDays);

        for(User user : fourtyDaysUsers) {
            if(!Boolean.TRUE.equals(user.getReviewEmailSent())){
                try{
                    emailService.sendAccountReview(user.getEmail(), user.getFullName());
                    user.setReviewEmailSent(true);
                    userRepo.save(user);
                    log.info("Successfully sent 40 days warning email to: {}", user.getEmail());
                }
                catch (Exception e){
                    log.error("Error sending 40 days warning email to: {}", user.getEmail());
                }

            }
        }

        log.info("Completed inactive user check." +
                "30 days warning sent: {}\n\n" +
                "40 days review sent: {}",
                thirtyDaysUsers.size(),
                fourtyDaysUsers.size());
    }
}
