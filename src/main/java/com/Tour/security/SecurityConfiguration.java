package com.Tour.security;

import com.Tour.service.JwtService;
import com.Tour.service.TokenService;
import com.Tour.utils.Roles;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import static com.Tour.utils.Permissions.*;


@EnableWebSecurity
@Configuration
@RequiredArgsConstructor
public class SecurityConfiguration {
    private  final  String[] SECURED_URLS_ADMIN = {"/holiday-plan/api/admin/**"};
    private  final  String[] SECURED_URLS_EDIT_USER = {"/holiday-plan/api/user/**"};
    private  final  String[] SECURED_URLS_EDIT_USER_HOLIDAY = {"/holiday-plan/api/holiday/**"};
    private  final  String[]  AUTHENTICATE_PATH={"/holiday-plan/api/authenticate/**","/holiday-plan/api/logout/"};
    private  final  String[] SECURE_QUERY_END_POINT ={"/holiday-plan/api/user-query/**"};
    @Autowired
    private CustomerAuthenticationProvider authenticationProvider;
    @Autowired
    private  CustomerUserDetailsService userDetailsService;


    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private  final  LogoutService logoutHandler;

    private final JwtService jwtService;
    private final TokenService tokenService;
   private  final  AuthenticationConfiguration authenticationConfiguration;


   @Bean
   public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        //Add login url to filter
         var customerAuthFilter =
                 CustomerAuthenticationFilter.builder().
                         authenticationManager(authenticationManager()).
                         userDetailsService(userDetailsService).
                         jwtService(jwtService).tokenService(tokenService).
                         build();

        customerAuthFilter.setFilterProcessesUrl("/holiday-plan/api/authenticate/user/login/");

             http.csrf().disable()
               .authorizeHttpRequests(auth -> auth
                       .requestMatchers(AUTHENTICATE_PATH).permitAll()
                       .requestMatchers(HttpMethod.POST,SECURED_URLS_EDIT_USER_HOLIDAY).permitAll()

                       //.requestMatchers("/holiday-plan/api/admin/user/save/").permitAll()
                       .requestMatchers(SECURED_URLS_ADMIN).hasRole(Roles.ADMIN.name())
                       .requestMatchers(HttpMethod.DELETE,SECURED_URLS_EDIT_USER).hasAuthority(USER_WRITE.name())
                       .requestMatchers(HttpMethod.PUT,SECURED_URLS_EDIT_USER).hasAuthority(USER_WRITE.name())
                       .requestMatchers(HttpMethod.PATCH,SECURED_URLS_EDIT_USER).hasAuthority(USER_WRITE.name())
                       .requestMatchers(HttpMethod.GET,SECURED_URLS_EDIT_USER).hasAnyAuthority(USER_WRITE.name(),USER_READ.name())
                       .requestMatchers(SECURED_URLS_EDIT_USER).hasAuthority(USER_WRITE.name())

                       .requestMatchers(HttpMethod.DELETE,SECURED_URLS_EDIT_USER_HOLIDAY).hasAnyAuthority(HOLIDAYPLAN_WRITE.name())
                       .requestMatchers(HttpMethod.PUT,SECURED_URLS_EDIT_USER_HOLIDAY).hasAnyAuthority(HOLIDAYPLAN_WRITE.name())
                       .requestMatchers(HttpMethod.PATCH,SECURED_URLS_EDIT_USER_HOLIDAY).hasAnyAuthority(HOLIDAYPLAN_WRITE.name())
                       .requestMatchers(HttpMethod.GET,SECURED_URLS_EDIT_USER_HOLIDAY).hasAnyAuthority(HOLIDAYPLAN_WRITE.name(),HOLIDAYPLAN_READ.name())

                       .requestMatchers(SECURE_QUERY_END_POINT).hasAnyAuthority(QUERY_READ.name(),QUERY_WRITE.name())
                       .anyRequest().authenticated()
               )
               .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
               .and().authenticationProvider(authenticationProvider)
               .addFilter(customerAuthFilter)
               .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
               .logout().logoutUrl("/holiday-plan/api/logout/").
                addLogoutHandler(logoutHandler)
               .logoutSuccessHandler(((request, response, authentication) -> {
                   // Cookie cookie = new Cookie("username", null);

                   for(var cookie :request.getCookies()) {
                       cookie.setAttribute("token",null);
                       cookie.setMaxAge(0);
                       cookie.setSecure(true);
                       cookie.setHttpOnly(true);
                       cookie.setPath("/");
                       response.addCookie(cookie);

                   }
                   SecurityContextHolder.clearContext();
                   response.setStatus(HttpServletResponse.SC_OK);

               }

               ));

       return  http.build();

   }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder(){
        return  new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager() throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }


}
