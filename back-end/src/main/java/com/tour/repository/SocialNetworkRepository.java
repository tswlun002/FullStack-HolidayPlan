package com.tour.repository;

import com.tour.model.SocialNetwork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Set;

@Repository
public interface SocialNetworkRepository extends JpaRepository<SocialNetwork,Long> {


    @Query("select s from SocialNetwork s join fetch s.app h where h.name=:name")
    Set<SocialNetwork> findSocial(String name);
}
