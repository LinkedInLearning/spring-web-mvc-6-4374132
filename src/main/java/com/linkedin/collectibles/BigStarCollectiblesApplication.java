package com.linkedin.collectibles;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@SpringBootApplication
public class BigStarCollectiblesApplication {

	public static void main(String[] args) {
		SpringApplication.run(BigStarCollectiblesApplication.class, args);
	}

	@Bean
	public Executor asyncExecutor(){
		ThreadPoolTaskExecutor threadPoolTaskExecutor = new ThreadPoolTaskExecutor();
		threadPoolTaskExecutor.setCorePoolSize(2);
		threadPoolTaskExecutor.setMaxPoolSize(2);
		threadPoolTaskExecutor.setQueueCapacity(500);
		threadPoolTaskExecutor.setThreadNamePrefix("Spring-Async");
		threadPoolTaskExecutor.initialize();
		return threadPoolTaskExecutor;
	}

}
