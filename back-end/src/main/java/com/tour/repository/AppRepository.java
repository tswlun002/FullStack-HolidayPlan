package com.tour.repository;
import com.tour.model.App;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.Set;
@Repository
public interface AppRepository extends JpaRepository<App,Long> {

    @Query("select h from App h join fetch h.address join fetch h.contact")
    Set<App> findAllLTHoliday();
    @Query("select h from App h join fetch h.address  join fetch h.contact where h.name=:name" )
    Optional<App> findByName(String name);
}
