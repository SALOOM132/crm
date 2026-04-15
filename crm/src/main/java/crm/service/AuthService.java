package crm.service;

import crm.model.User;
import crm.model.enumerations.RoleEnum;
import crm.repository.UserRepository;
import crm.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       AuthenticationManager authManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authManager = authManager;
    }

    public Map<String, String> login(String username, String password) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(username, user.getRole().name());
        return Map.of(
                "token", token,
                "role", user.getRole().name(),
                "fullName", user.getFullName(),
                "username", username
        );
    }

    public User createUser(String username, String password, String fullName, RoleEnum role) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setFullName(fullName);
        user.setRole(role);
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAllByOrderByIdAsc();
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User toggleUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(!user.isEnabled());
        return userRepository.save(user);
    }

    public User updateUser(Long id, String fullName, String password) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (fullName != null) user.setFullName(fullName);
        if (password != null && !password.isBlank()) {
            user.setPassword(passwordEncoder.encode(password));
        }
        return userRepository.save(user);
    }

    // Create default admin on startup if no users exist
    public void createDefaultAdmin() {
        if (userRepository.count() == 0) {
            createUser("admin", "admin123", "Administrator", RoleEnum.ADMIN);
            System.out.println("=== Default admin created: admin / admin123 ===");
        }
    }
}
