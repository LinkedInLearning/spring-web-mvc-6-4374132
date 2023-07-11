package com.linkedin.collectibles.controllers;

import com.linkedin.collectibles.beans.User;
import com.linkedin.collectibles.dao.UserRepository;
import com.linkedin.collectibles.validators.UserValidator;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class UserController {

    //private UserValidator userValidator;

    private UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
        //this.userValidator = userValidator;
    }

   /* @InitBinder
    public void bindUser(WebDataBinder binder){
        binder.addValidators(this.userValidator);
    }*/

    @GetMapping("/newUser")
    public String displayRegistrationForm(Model model){
        model.addAttribute("user", new User());
        return "register-user";
    }

    @PostMapping("/saveUser")
    public String saveUser(@ModelAttribute("user") @Valid User user, BindingResult result, Model model){
        //validate & save to DB

        if(result.hasErrors()) {
            return "register-user";
        }
        User savedUser = userRepository.save(user);
        if(savedUser != null){
            model.addAttribute("userSaved", true);
        }
        return "register-user";
    }
}
