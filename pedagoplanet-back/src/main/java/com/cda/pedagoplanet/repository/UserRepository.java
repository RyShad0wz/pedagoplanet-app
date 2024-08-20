package com.cda.pedagoplanet.repository;
import com.cda.pedagoplanet.entity.User;
import com.cda.pedagoplanet.exception.UserNotFoundException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findById(Long id);
    User getUserById(Long id) throws UserNotFoundException;
    User findByUsername(String email);
    User findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);
    List<User> findByCourses_Id(Long courseId);
    Optional<User> findWithCoursesById(Long id);
    @Query("SELECT u FROM User u WHERE u.firstName LIKE %:name% OR u.lastName LIKE %:name%")
    List<User> searchUsersByName(@Param("name") String name);
}


