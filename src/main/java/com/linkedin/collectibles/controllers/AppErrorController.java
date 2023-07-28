package com.linkedin.collectibles.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class AppErrorController implements ErrorController {
    @RequestMapping("/error")
    public String handleErrors(HttpServletRequest request, HttpServletResponse response){
        int statusCode = response.getStatus();
        if(statusCode == 404){
            return "not-found";
        }
        return "error";

    }
}
