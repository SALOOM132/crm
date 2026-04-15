package crm.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import crm.model.User;
import crm.model.enumerations.RoleEnum;
import crm.service.AuthService;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AuthService authService;

    public AdminController(AuthService authService) {
        this.authService = authService;
    }

    // GET /admin/users
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return authService.getAllUsers();
    }

    // POST /admin/users
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> body) {
        try {
            RoleEnum role = RoleEnum.valueOf(body.getOrDefault("role", "AGENT").toUpperCase());
            User user = authService.createUser(
                    body.get("username"),
                    body.get("password"),
                    body.get("fullName"),
                    role
            );
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE /admin/users/{id}
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        authService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted"));
    }

    // PATCH /admin/users/{id}/toggle
    @PatchMapping("/users/{id}/toggle")
    public User toggleUser(@PathVariable Long id) {
        return authService.toggleUser(id);
    }

    // PUT /admin/users/{id}
    @PutMapping("/users/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return authService.updateUser(id, body.get("fullName"), body.get("password"));
    }
}
