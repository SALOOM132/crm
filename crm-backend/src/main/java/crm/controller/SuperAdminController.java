package crm.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import crm.model.User;
import crm.model.enumerations.RoleEnum;
import crm.service.AuthService;

@RestController
@RequestMapping("/superadmin")
public class SuperAdminController {

    private final AuthService authService;

    public SuperAdminController(AuthService authService) {
        this.authService = authService;
    }

    // GET /superadmin/admins — list all admins
    @GetMapping("/admins")
    public List<User> getAllAdmins() {
        return authService.getAllUsers().stream()
                .filter(u -> u.getRole() == RoleEnum.ADMIN)
                .collect(Collectors.toList());
    }

    // GET /superadmin/users — list all users
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return authService.getAllUsers();
    }

    // POST /superadmin/admins — create an admin
    @PostMapping("/admins")
    public ResponseEntity<?> createAdmin(@RequestBody Map<String, String> body) {
        try {
            User user = authService.createUser(
                    body.get("username"),
                    body.get("password"),
                    body.get("fullName"),
                    RoleEnum.ADMIN
            );
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE /superadmin/admins/{id}
    @DeleteMapping("/admins/{id}")
    public ResponseEntity<?> deleteAdmin(@PathVariable Long id) {
        authService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "Admin deleted"));
    }

    // PATCH /superadmin/users/{id}/toggle
    @PatchMapping("/users/{id}/toggle")
    public User toggleUser(@PathVariable Long id) {
        return authService.toggleUser(id);
    }
}
