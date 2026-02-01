package org.example.jobboard.config;
//
//
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import lombok.RequiredArgsConstructor;
//import org.example.jobboard.service.JwtService;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import java.io.IOException;
//
//
//// Check for valid token every time send request to api
//@Component
//@RequiredArgsConstructor
//
//public class JwtAuthConfig extends OncePerRequestFilter {
//    private final JwtService jwtService;
//    private final UserDetailsService userDetailsService;
//
//    @Override
//    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
//        throws ServletException, IOException{
//        final String header = req.getHeader("Authorization");
//        if (header == null || !header.startsWith("Bearer ")) {
//            chain.doFilter(req, res);
//            return;
//        }
//        // extract token here
//        final String token = header.substring(7);
//        final String username = jwtService.extractUsername(token);
//        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
//            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
//            System.out.println("========================================");
//            System.out.println("🔎 DEBUGGING USER IDENTITY:");
//            System.out.println("👤 Username: " + username);
//            System.out.println("🔑 Authorities: " + userDetails.getAuthorities());
//            System.out.println("🛡️ Account Enabled: " + userDetails.isEnabled());
//            System.out.println("========================================");
//            if(jwtService.isValidToken(token, userDetails.getUsername())){
//                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
//                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
//                SecurityContextHolder.getContext().setAuthentication(authentication);
//
//                System.out.println("📢 USER LOGGED IN: " + username);
//                System.out.println("📢 AUTHORITIES: " + userDetails.getAuthorities());
//            }
//        }
//
//        chain.doFilter(req, res);
//
//    }
//}

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.example.jobboard.service.JwtService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthConfig extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {

        System.out.println("📡 Request Hit: " + req.getRequestURI());
        final String header = req.getHeader("Authorization");

        // 🔍 DEBUG 1: Did the request hit the filter?
        if (header != null && header.startsWith("Bearer ")) {
            System.out.println("🔹 FILTER REACHED. Token found in header.");

            final String token = header.substring(7);
            try {
                // This is the "Danger Zone" where it likely crashes
                final String username = jwtService.extractUsername(token);

                // 🔍 DEBUG 2: Did extraction work?
                System.out.println("✅ TOKEN PARSED. Username: " + username);

                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                    // 🔍 DEBUG 3: Identity Check
                    System.out.println("👤 User Loaded: " + userDetails.getUsername());
                    System.out.println("🔑 Authorities: " + userDetails.getAuthorities());

                    if (jwtService.isValidToken(token, userDetails)) {
                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        System.out.println("🛡️ AUTHENTICATION SET SUCCESS");
                    } else {
                        System.out.println("❌ TOKEN INVALID according to isTokenValid()");
                    }
                }
            } catch (Exception e) {
                // 🚨 CATCH THE CRASH
                System.out.println("🔥 CRASH IN FILTER: " + e.getMessage());
                e.printStackTrace(); // This will print the full error in console
            }
        } else {
            // Uncomment to see requests without tokens (like login/register)
             System.out.println("⚪ No Token in request to: " + req.getRequestURI());
        }

        chain.doFilter(req, res);
    }
}