package org.example.jobboard.config;

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
            throws ServletException, IOException{
        final String header = req.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            final String token = header.substring(7);
            try {
                final String username = jwtService.extractUsername(token);
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null){
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    if (jwtService.isValidToken(token, userDetails)){
                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        System.out.println("Authentication successful");
                    } else{
                        // isTokenValid()
                        System.out.println("Token not valid");
                    }
                }
            } catch (Exception e) {
                e.printStackTrace(); // will print error in console
            }
        } else {
             System.out.println("Token error");
        }

        chain.doFilter(req, res);
    }
}