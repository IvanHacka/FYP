package org.example.jobboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class WatchListResponse {
    private Long id;
    private Long jobId;
    private String title;
    private String location;
    private String description;
    private BigDecimal minSalary;
    private LocalDateTime savedAt;

}
