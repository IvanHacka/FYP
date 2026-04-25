package org.example.jobboard.dto;


import lombok.Data;


@Data
public class ApplyJobRequest {
    private Long jobId;
    private String whyGoodFit;
}
