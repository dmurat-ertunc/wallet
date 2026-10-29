package com.fin.wallet.config;

import com.fin.wallet.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration  //Bu sınıf Spring ayarlarını içeriyor, Spring açılışta bu sınıfı okusun
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;


    @Bean  // configuration ile bean metot tanımladık spring bu metodu kendisi çağırır ben çağırmam
    public PasswordEncoder passwordEncoder() { // geriye bir "şifreleyici" döndürüyor
        return new BCryptPasswordEncoder();  //BCrypt kullanan yeni bir şifreleyici oluşturuyor ve onu döndürüyor
    }

    @Bean //@Bean olduğu için Spring bu listeyi alıp tüm isteklere uyguluyor.
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
//        CSRF saldırısı şöyle işler: sen bankanın sitesine giriş yapmışsın ve tarayıcında oturum cookie'si duruyor.
//        Kötü bir site sana gizlice bankaya istek attırıyor.
//        Tarayıcı cookie'yi otomatik olarak eklediği için banka isteği senden geliyor sanıyor.
//
//        Bizde cookie yok. Token'ı mobil uygulama Authorization başlığına kendisi ekliyor,
//        tarayıcı bunu otomatik yapmıyor. Bu yüzden CSRF saldırısı bize işlemez.
//        Koruma açık kalsaydı POST/PUT/DELETE isteklerimizi gereksiz yere engellerdi.
                .cors(Customizer.withDefaults())
//        "CORS için ayrıca ayar yazmıyorum, zaten var olanı kullan."
//        Spring, WebConfig içinde yazdığın addCorsMappings ayarını bulup kullanıyor.
//        Bu satır olmazsa Expo web sürümünün tarayıcıdan yaptığı istekler güvenlik katmanında takılabilir.
//        Telefondaki (native) uygulama CORS'tan etkilenmez.
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//        "Sunucuda oturum oluşturma, cookie gönderme."
//        Kimlik her istekte token'dan okunacak.
//        SecurityContextHolder kutusu her istek bitince boşalacak ve sunucu kimseyi "hatırlamayacak".
                .authorizeHttpRequests(auth -> auth
//        kurallar listesi
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/error").permitAll()
                        .anyRequest().authenticated())
//        Sıra önemli: Spring kuralları yukarıdan aşağı okur ve ilk eşleşen kuralı uygular.
//        anyRequest() en başta olsaydı her şeyi yakalar, alttaki kurallar hiç çalışmazdı.
//        Bu yüzden genel kural hep en sonda durur.
                .exceptionHandling(exception -> exception
//        "Kimliği olmayan biri kilitli bir adrese gelirse ona 401 dön."
//        Hatırlarsan 401/403 farkını anlatırken bu tuzaktan bahsetmiştim:
//        bu satır olmadan Spring bazı durumlarda 403 döner ve mobil taraf "token'ın yok" ile "yetkin yok" durumlarını ayırt edemez.
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
                //Bu filtreyi zincire ekle ve UsernamePasswordAuthenticationFilter'dan önce çalıştır.
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
//        "Benim filtremi zincire ekle, Spring'in standart kullanıcı adı/şifre filtresinden önce çalışsın."
//        Böylece yetki kontrolüne gelindiğinde kimlik kutusu zaten dolu olur.
        return http.build();
    }


}
