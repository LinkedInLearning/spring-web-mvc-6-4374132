package com.linkedin.collectibles.restcontrollers;

import com.linkedin.collectibles.beans.Product;
import com.linkedin.collectibles.dao.ProductRepository;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class ProductRestController {

    private ProductRepository productRepository;

    public ProductRestController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping("/bigstar/api/products")
    public List<Product> allProducts(){
        List<Product> products = new ArrayList<>();
        return (List<Product>) productRepository.findAll();

    }

    @GetMapping("/bigstar/api/products/{id}")
    public Product getProductById(@PathVariable("id") String id){
        return productRepository.findById(Integer.valueOf(id)).orElseThrow(()-> new ProductNotFoundException(id));
    }

    @PostMapping("/bigstar/api/products")
    public Product saveProduct(@RequestBody Product newProduct){
        return  productRepository.findById(newProduct.getId()).map(product -> {
            product.setName(newProduct.getName());
            product.setDescription(newProduct.getDescription());
            product.setColor(newProduct.getColor());
            product.setCategoryId(newProduct.getCategoryId());
            product.setRobotId(newProduct.getRobotId());
            product.setImagePath(newProduct.getImagePath());
            product.setRating(newProduct.getRating());
            product.setNoOfReviews(newProduct.getNoOfReviews());
            product.setPrice(newProduct.getPrice());
            return productRepository.save(product);
        }).orElseGet(()->{
            return productRepository.save(newProduct);
        });
    }
}
