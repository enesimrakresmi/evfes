# BİZİM EVRENİMİZ

<p align="center">
  <strong>Enes ve Efsa için tasarlanmış romantik, sinematik ve tek ekranlık dijital evren.</strong>
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-Ready-3178c6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-Database%20%2B%20Storage-3fcf8e?style=for-the-badge&logo=supabase&logoColor=white" />
  <img alt="Vercel" src="https://img.shields.io/badge/Vercel-Deploy-black?style=for-the-badge&logo=vercel" />
</p>

---

## Proje Özeti

**BİZİM EVRENİMİZ**, anıların yıldızlara dönüştüğü romantik bir web uygulamasıdır.

Site açıldığında karanlık ve zarif bir evren görünür. Binlerce yıldız hareket ederek `Enes ❤ Efsa` yazısını oluşturur, kısa bir süre bekler ve sonra tekrar evrene dağılır. Ardından Supabase veritabanından gelen anılar sabit yıldızlar olarak ekranda kalır.

Her anı bir yıldızdır. Bir yıldıza tıklandığında premium cam efektiyle hazırlanmış bir modal açılır ve anının başlığı, görseli, mesajı ve tarihi gösterilir.

Bu proje özellikle şu prensiplerle hazırlanmıştır:

- Tek ekran deneyimi
- Scroll yok
- Landing page yok
- Timeline yok
- JSON dosyası yok
- Tüm anılar Supabase üzerinden yönetilir

---

## Özellikler

- Tam ekran, scroll olmayan romantik evren arayüzü
- Yıldızlardan oluşan açılış animasyonu
- `Enes ❤ Efsa` yazısını oluşturan sinematik particle sistemi
- Supabase veritabanından gelen anı yıldızları
- Her anı için kalıcı `x` ve `y` koordinatları
- Yıldız konumları oluşturulduktan sonra değişmez
- Glassmorphism detay modalı
- ESC tuşu ve kapatma butonu desteği
- Mobil ve masaüstü uyumlu tasarım
- Touch ve mouse desteği
- LocalStorage ile keşfedilen anıları takip etme
- Şifre korumalı `/admin` paneli
- Admin panelinden görselli veya görselsiz anı ekleme, düzenleme ve silme
- İsteğe bağlı görsel yükleme desteği
- Görselleri yüklemeden önce tarayıcıda optimize etme
- WebP dönüştürme
- Maksimum 1920px genişlik
- 0.80 kalite oranı
- Görsel seçilirse yalnızca optimize edilmiş WebP dosyasını Supabase Storage'a yükleme
- Vercel dağıtımına hazır yapı

---

## Kullanılan Teknolojiler

| Teknoloji | Amaç |
| --- | --- |
| Next.js 15 | App Router tabanlı modern React uygulaması |
| TypeScript | Tip güvenliği ve sürdürülebilir kod |
| Tailwind CSS | Hızlı, tutarlı ve responsive tasarım |
| Framer Motion | Yumuşak geçişler ve animasyonlar |
| Supabase Database | Anıların veritabanında tutulması |
| Supabase Storage | Optimize edilmiş görsellerin saklanması |
| browser-image-compression | Görselleri tarayıcıda WebP olarak sıkıştırma |
| Vercel | Production deployment |

---

## Klasör Yapısı

```txt
app/
  admin/
    page.tsx
  api/
    admin/
      memories/
        route.ts
        [id]/route.ts
      session/route.ts
      upload/route.ts
    memories/route.ts
  globals.css
  layout.tsx
  page.tsx

components/
  admin-panel.tsx
  intro-particles.tsx
  memory-modal.tsx
  universe.tsx
  use-memories.ts

lib/
  admin-auth.ts
  memory-utils.ts
  supabase/
    server.ts
  types.ts

supabase/
  schema.sql
```

---

## Kurulum

### 1. Bağımlılıkları yükle

```bash
npm install
```

### 2. Supabase projesi oluştur

1. [Supabase](https://supabase.com) hesabına giriş yap.
2. Yeni bir proje oluştur.
3. Proje hazır olduktan sonra SQL Editor bölümüne gir.
4. Bu projedeki `supabase/schema.sql` dosyasının içeriğini çalıştır.

Bu SQL dosyası şunları oluşturur:

- `memories` tablosu
- Public okuma politikası
- `memories` storage bucket ayarı
- WebP görseller için storage politikası

### 3. Ortam değişkenlerini hazırla

Proje kök dizininde `.env.local` dosyası oluştur:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=memories
ADMIN_PASSWORD=use-a-long-private-password
ADMIN_SESSION_SECRET=use-a-random-32-plus-character-secret
```

Değerleri Supabase panelinden ve kendi admin tercihlerinden alman gerekiyor.

| Değişken | Açıklama |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase proje URL'i |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin işlemleri için service role key |
| `SUPABASE_STORAGE_BUCKET` | Görsellerin yükleneceği bucket adı |
| `ADMIN_PASSWORD` | `/admin` paneline giriş şifresi |
| `ADMIN_SESSION_SECRET` | Admin cookie imzası için gizli anahtar |

> `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD` ve `ADMIN_SESSION_SECRET` kesinlikle client tarafında kullanılmamalıdır. Bu projede yalnızca server-side API route içinde kullanılırlar.

### 4. Lokal ortamda çalıştır

```bash
npm run dev
```

Tarayıcıda aç:

```txt
http://localhost:3000
```

Admin paneli:

```txt
http://localhost:3000/admin
```

---

## Supabase Veritabanı Şeması

`memories` tablosu:

```sql
create table public.memories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  image_url text,
  x double precision not null,
  y double precision not null,
  color text not null,
  created_at timestamp with time zone not null default now()
);
```

Alanların anlamı:

| Alan | Açıklama |
| --- | --- |
| `id` | Her anı için benzersiz kimlik |
| `title` | Anı başlığı |
| `message` | Anı mesajı |
| `image_url` | Supabase Storage görsel URL'i |
| `x` | Yıldızın yatay konumu |
| `y` | Yıldızın dikey konumu |
| `color` | Yıldız rengi |
| `created_at` | Oluşturulma tarihi |

Anı oluşturulduğunda `x` ve `y` koordinatları otomatik üretilir ve veritabanına kaydedilir. Daha sonra anı düzenlense bile bu koordinatlar değiştirilmez.

---

## Admin Panel Kullanımı

Admin paneline şu adresten girilir:

```txt
/admin
```

Giriş için `.env.local` içinde belirlediğin `ADMIN_PASSWORD` kullanılır.

Admin panelinde şunları yapabilirsin:

- Yeni anı ekleme
- Mevcut anıyı düzenleme
- Anı silme
- Görsel yükleme
- Yüklenen görseli otomatik optimize etme

Görsel seçersen uygulama yükleme sırasında şunları yapar:

1. Görseli tarayıcıda işler.
2. WebP formatına dönüştürür.
3. Genişliği maksimum 1920px olacak şekilde küçültür.
4. Kaliteyi 0.80 olarak uygular.
5. Metadata bilgisini mümkün olduğunca temizler.
6. Sadece optimize edilmiş dosyayı Supabase Storage'a yükler.

Orijinal görsel saklanmaz. Görsel seçmek zorunlu değildir; başlık ve mesajla da anı oluşturulabilir.

---

## Keşif Sistemi

Kullanıcı bir anıya tıkladığında o anı keşfedilmiş sayılır.

Keşfedilen anılar tarayıcıdaki `localStorage` içinde tutulur. Bu yüzden her ziyaretçi kendi cihazında kendi keşif ilerlemesini görür.

Ekranda şu formatta gösterilir:

```txt
Keşfedilen Anılar: 7 / 25
```

---

## Vercel'e Yayınlama

1. Projeyi GitHub'a yükle.
2. [Vercel](https://vercel.com) hesabına giriş yap.
3. Yeni proje olarak GitHub reposunu seç.
4. Environment Variables bölümüne `.env.local` içindeki tüm değerleri ekle.
5. Deploy butonuna bas.
6. Deploy tamamlandıktan sonra ana sayfa ve `/admin` panelini kontrol et.

Vercel ortam değişkenleri şunlar olmalı:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_STORAGE_BUCKET=memories
ADMIN_PASSWORD=...
ADMIN_SESSION_SECRET=...
```

---

## Production Notları

- Public evren sayfası anıları `/api/memories` üzerinden okur.
- Admin işlemleri server-side API route'lar ile yapılır.
- Supabase service role key yalnızca server tarafında kullanılır.
- Admin oturumu httpOnly imzalı cookie ile korunur.
- Upload API yalnızca `image/webp` dosyalarını kabul eder.
- Storage bucket public olduğu için `next/image` görselleri doğrudan gösterebilir.
- Görsel optimizasyonu upload öncesinde tarayıcıda yapılır.
- Anı yıldızlarının konumları veritabanında kalıcı olarak saklanır.

---

## Kontrol Komutları

Production build almak için:

```bash
npm run build
```

Lint kontrolü için:

```bash
npm run lint
```

Uygulamayı production modda çalıştırmak için:

```bash
npm run build
npm run start
```

---

## Kısa Özet

Bu proje, klasik bir anı sayfası değil; Enes ve Efsa için hazırlanmış özel bir dijital evrendir. Anılar veritabanında yaşar, gökyüzünde yıldız olarak görünür ve her keşif küçük, zarif bir hikayeye dönüşür.


