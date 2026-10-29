package com.fin.wallet.security;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

// Her istekte Authorization başlığındaki token'ı okur.
// Token geçerliyse kullanıcıyı SecurityContext'e koyar; değilse kimlik atamadan isteği devam ettirir.
// Kimliksiz bir isteğin reddedilip reddedilmeyeceğine SecurityConfig karar verir.

//OncePerRequestFilter, Java'nın jakarta.servlet.Filter arayüzünü uygulayan bir Spring sınıfı.
//Ondan türediğin için senin sınıfın da bir filtre oluyor.
//Filtreler her zaman DispatcherServlet'ten, dolayısıyla controller'dan önce çalışır

//Bir filtrenin kuralı basit: Tomcat isteği verir, sen işini yaparsın,
//sonra filterChain.doFilter(...) diyerek isteği bir sonrakine geçirirsin.
//doFilterInternal metodunun imzasında request, response ve filterChain parametrelerinin bulunması bu yüzden.
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtService jwtService;

    private final UserDetailsService userDetailsService;

    //backende gelen her istek controllera gitmeden buradan geçiyor
    //Görevi tek cümleyle şu: token'ı oku, geçerliyse Spring'e "bu istek şu kullanıcıdan geliyor"
    @Override
//    Bu metot üst sınıf OncePerRequestFilter'dan geliyor. Biz sadece içini dolduruyoruz.
//    Spring her istekte bu metodu kendisi çağırıyor, sen hiçbir yerde çağırmıyorsun.
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

//        request: Gelen istek. Adresi, başlıkları ve gövdesi bunun içinde.
//        response: Gidecek cevap. Biz burada dokunmuyoruz.
//        filterChain: Sıradaki filtrelerin listesi. İsteği bir sonraki kontrol noktasına geçirmek için kullanılıyor.
//        throws ...: filterChain.doFilter bu iki hatayı fırlatabildiği için imzada yazmak zorundayız.
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        // Token yoksa (ör. login isteği) hiçbir şey yapmadan devam et
        if (header == null || !header.startsWith(BEARER_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        //Token'ı başlıktan ayır
        String token = header.substring(BEARER_PREFIX.length());
        try {
            //Token'ı doğrula ve içinden kullanıcı adını al
            String userName = jwtService.extractUserName(token);

//            Token geçerli olsa bile şunu kontrol ediyoruz: bu kullanıcı veritabanında hâlâ duruyor mu?
//            Adım 4'teki CustomUserDetailsService çalışıyor ve findByUserName("murat") sorgusunu atıyor.
//
//            Neden gerekli? Token 24 saat geçerli. Bu süre içinde kullanıcı silinmiş olabilir.
//            Silindiyse UsernameNotFoundException fırlıyor ve yine catch bloğuna gidiliyor.
            UserDetails userDetails = userDetailsService.loadUserByUsername(userName);

            if (userDetails.isEnabled()) {
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
                //bundan sonra bu isteğin kimden geldiğini belirtiyor
            }
        } catch (JwtException | UsernameNotFoundException ex) {
            // Bozuk, süresi dolmuş veya silinmiş kullanıcıya ait token: kimlik atanmaz
        }

//        "Sıradaki kontrol noktasına geç." Bileklik takılmış olsa da olmasa da bu satır çalışıyor.
//        Bu satır olmasaydı istek kapıda takılıp kalırdı, kimse içeri giremezdi.
        filterChain.doFilter(request, response);
    }

}

//        Bir konser salonu düşün. Kapıda bir görevli var (bizim filtre), içeride de bilet kontrolcüleri (SecurityConfig).
//
//        Görevli kapıya gelen herkesin bileğine bakıyor:
//
//        Biletin geçerliyse bileğine renkli bir bileklik takıyor.
//        Biletin sahte ya da süresi geçmişse bileklik takmıyor. Ama seni kovmuyor da, "geç" diyor.
//        Her iki durumda da seni içeri yürütüyor.
//        İçeride:
//
//        Lobi (/api/auth/login) herkese açık. Bileklik sorulmuyor.
//        Konser salonu (/api/expenses) bileklik istiyor. Bilekliğin yoksa kontrolcü seni geri çeviriyor: 401.