package crm;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import crm.model.enumerations.RoleEnum;
import crm.service.AuthService;

@Component
public class AppStartup implements ApplicationRunner {

    private final AuthService authService;

    public AppStartup(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public void run(ApplicationArguments args) {
        // Create default super admin if no users exist
        try {
            authService.createUser("superadmin", "superadmin123", "Super Administrator", RoleEnum.SUPER_ADMIN);
            System.out.println("=== Default super admin created: superadmin / superadmin123 ===");
        } catch (Exception e) {
            // Already exists — skip
        }
    }
}
