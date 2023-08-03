package com.linkedin.collectibles.controllers;

import com.linkedin.collectibles.beans.Filter;
import com.linkedin.collectibles.beans.Product;
import com.linkedin.collectibles.beans.ProductCategory;
import com.linkedin.collectibles.dao.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.async.DeferredResult;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executor;

@Controller
public class ProductController {

    private final Logger logger = LoggerFactory.getLogger(ProductController.class);

    private ProductRepository productRepository;

    private Executor asyncExecutor;

    public ProductController(ProductRepository productRepository, Executor asyncExecutor) {
        this.asyncExecutor = asyncExecutor;
        this.productRepository = productRepository;
    }

    @PostMapping("/search")
    public String search(@RequestParam("searchString") String keyword, Model model) {

        List<Product> products = productRepository.searchByName(keyword);
        model.addAttribute("products", products);
        model.addAttribute("searchedFor", keyword);

        return "search-results";
    }

    @GetMapping("/getAllProducts")
    public DeferredResult<String> getAllProducts(Model model) {
        DeferredResult<String> deferredResult = new DeferredResult<>();
        asyncExecutor.execute(() -> {
            model.addAttribute("products", getProducts());
            model.addAttribute("filter", new Filter());
            deferredResult.setResult("product-list");
        });
        return deferredResult;
    }

    @PostMapping("/filterProducts")
    public String filterProductsBasedOnProductType(@ModelAttribute("filter") Filter filter, Model model) {
        // get all selected types
        //get the category_id for every type and query the DB

        List<Product> filteredProducts = new ArrayList<>();
        List<String> selectedTypes = filter.getSelectedType();
        for (String token : selectedTypes) {
            if (token.equals("ALL")) {
                productRepository.findAll().forEach(product -> {
                    filteredProducts.add(product);
                });
                break;
            }
            else{
                int categoryId = ProductCategory.valueOf(token).getId();
                filteredProducts.addAll(productRepository.searchByCategoryId(categoryId));
            }
        }
        model.addAttribute("products", filteredProducts);
        model.addAttribute("filter", filter);

        return "product-list";
    }

    private Iterable<Product> getProducts() {

        logger.info("Getting all products, we are on the spring executor thread");
        try {
            Thread.sleep(6000);
        } catch (InterruptedException exception) {
            throw new RuntimeException();
        }
        return productRepository.findAll();
    }

    @GetMapping("/getProductDetails")
    public String getProductDetails(Model model, @RequestParam("id") String productId) {
        model.addAttribute("product", productRepository.searchById(productId));
        return "product-details";
    }

    @PostMapping("/addToCart")
    public String addToCart(Model model, @SessionAttribute("cart") Map<String, Integer> cart,
                            @RequestParam("productId") String productId, @RequestParam("quantity") Integer quantity) {
        logger.info("Cart {}", cart);

        if (!cart.containsKey(productId)) {
            cart.put(productId, 0);
        }
        cart.put(productId, cart.get(productId) + quantity);
        logger.info("After adding to cart {}", cart);
        return "redirect:/getProductDetails?id=" + productId;
    }
}
