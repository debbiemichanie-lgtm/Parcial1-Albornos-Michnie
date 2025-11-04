# seed.ps1
$API = "http://localhost:5050/api"

# 1) registrá/logueá (si ya existe, el catch lo ignora)
try {
  Invoke-RestMethod "$API/auth/register" -Method Post -ContentType "application/json" `
    -Body '{"nombre":"Debbie","email":"deb@example.com","password":"123456"}' | Out-Null
} catch {}

$login = Invoke-RestMethod "$API/auth/login" -Method Post -ContentType "application/json" `
  -Body '{"email":"deb@example.com","password":"123456"}'
$token = $login.token
$H = @{ Authorization = "Bearer $token" }

# 2) data
$items = @(
  @{ nombre="Dra. Ana Pérez";    profesion="psicologa";      modality="virtual";    insurance="prepaga";    specialties=@("anorexia","bulimia");           city="Buenos Aires"; province="Buenos Aires"; email="ana@ejemplo.com" },
  @{ nombre="Lic. Bruno Gómez";  profesion="psicologo";      modality="presencial"; insurance="particular"; specialties=@("ansiedad","estrés");            city="CABA";         province="Buenos Aires"; email="bruno@ejemplo.com" },
  @{ nombre="Dra. Carla Ruiz";   profesion="nutricionista";  modality="hibrida";    insurance="obra social";specialties=@("celiaquía","obesidad");        city="La Plata";     province="Buenos Aires"; email="carla@ejemplo.com" },
  @{ nombre="Dr. Diego Álvarez"; profesion="medico clinico";modality="virtual";    insurance="particular"; specialties=@("control","chequeos");          city="Rosario";      province="Santa Fe";     email="diego@ejemplo.com" },
  @{ nombre="Lic. Eva Torres";   profesion="psicopedagoga";  modality="presencial"; insurance="prepaga";    specialties=@("TDAH","aprendizaje");         city="Córdoba";      province="Córdoba";      email="eva@ejemplo.com" },
  @{ nombre="Dra. Flor Ibarra";  profesion="dermatologa";    modality="hibrida";    insurance="obra social";specialties=@("acné","psoriasis");            city="Mendoza";      province="Mendoza";      email="flor@ejemplo.com" },
  @{ nombre="Dr. Gabriel Soto";  profesion="cardiologo";     modality="presencial"; insurance="particular"; specialties=@("hipertensión");               city="CABA";         province="Buenos Aires"; email="gabriel@ejemplo.com" },
  @{ nombre="Lic. Helena Paz";   profesion="psicologa";      modality="virtual";    insurance="particular"; specialties=@("parejas","duelo");             city="Buenos Aires"; province="Buenos Aires"; email="helena@ejemplo.com" },
  @{ nombre="Dra. Irene León";   profesion="ginecologa";     modality="virtual";    insurance="prepaga";    specialties=@("controles","embarazo");       city="Córdoba";      province="Córdoba";      email="irene@ejemplo.com" },
  @{ nombre="Dr. Juan Vera";     profesion="kinesiologo";    modality="presencial"; insurance="particular"; specialties=@("deportiva","dolor");          city="Rosario";      province="Santa Fe";     email="juan@ejemplo.com" }
)

# 3) crear (si existe email, no debería fallar; si querés, podés borrar antes)
foreach ($s in $items) {
  $body = $s | ConvertTo-Json -Depth 5
  try {
    $r = Invoke-RestMethod "$API/especialistas" -Method Post -Headers $H -ContentType "application/json" -Body $body
    "OK -> $($s.nombre) ($($r.data._id))"
  } catch {
    "ERR -> $($s.nombre)"
    $_.ErrorDetails.Message
  }
}

# 4) ver total
$r = Invoke-RestMethod "$API/especialistas"
"`nok total data"
$r.total
$r.data | Select-Object -First 2 _id,nombre,profesion,modality,insurance,city | Format-Table
