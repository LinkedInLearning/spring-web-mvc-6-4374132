package com.linkedin.collectibles.dao;

import com.linkedin.collectibles.beans.Product;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends CrudRepository<Product, Integer> {

    @Query("select p from Product p where p.name like %:searchString%")
    public List<Product> searchByName(@Param("searchString") String keyword);

    @Override
    Iterable<Product> findAll();
}
