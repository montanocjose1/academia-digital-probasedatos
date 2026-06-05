# Guía de Máquina Virtual - Despliegue de Academia Digital Pro

## 1. Creación de Máquina Virtual Ubuntu

### Requisitos Mínimos
- CPU: 2 cores
- RAM: 4 GB
- Disco: 20 GB
- SO: Ubuntu Server 22.04 LTS o 24.04 LTS

### Opción A: VirtualBox (Local)

```bash
# Descargar ISO de Ubuntu Server
# https://ubuntu.com/download/server

# Configurar VirtualBox:
# - Nombre: academia-digital-pro
# - Tipo: Linux
# - Versión: Ubuntu (64-bit)
# - RAM: 4096 MB
# - Disco: 25 GB (VDI)
# - Red: NAT + Host-Only
```

### Opción B: AWS EC2 (Cloud)

```bash
# 1. Acceder a AWS Console -> EC2
# 2. Launch Instance:
#    - Nombre: academia-digital-pro
#    - AMI: Ubuntu Server 22.04 LTS
#    - Tipo: t3.medium (2 vCPU, 4 GB RAM)
#    - Storage: 20 GB gp3
#    - Security Group:
#        - SSH (22): 0.0.0.0/0
#        - HTTP (80): 0.0.0.0/0
#        - HTTPS (443): 0.0.0.0/0
#        - Flask (5000): tu-ip/32
```

### Opción C: Google Cloud Platform

```bash
# 1. gcloud compute instances create academia-digital-pro \
#    --zone=us-central1-a \
#    --machine-type=e2-standard-2 \
#    --image-family=ubuntu-2204-lts \
#    --image-project=ubuntu-os-cloud \
#    --boot-disk-size=20GB
```

---

## 2. Configuración Inicial de Ubuntu

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependencias base
sudo apt install -y python3 python3-pip python3-venv
sudo apt install -y postgresql postgresql-contrib
sudo apt install -y nginx git curl
sudo apt install -y build-essential libssl-dev libffi-dev

# Verificar versiones
python3 --version
psql --version
nginx -v
git --version
```

---

## 3. Configurar PostgreSQL

```bash
# Iniciar PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Acceder a PostgreSQL
sudo -u postgres psql

# Crear base de datos y usuario
CREATE DATABASE academia_digital_pro;
CREATE USER academia_user WITH PASSWORD 'password_seguro_2026';
GRANT ALL PRIVILEGES ON DATABASE academia_digital_pro TO academia_user;
\c academia_digital_pro
GRANT ALL ON SCHEMA public TO academia_user;
\q

# Configurar conexión remota (opcional)
sudo nano /etc/postgresql/16/main/postgresql.conf
# Descomentar: listen_addresses = '*'

sudo nano /etc/postgresql/16/main/pg_hba.conf
# Agregar: host all all 0.0.0.0/0 md5

sudo systemctl restart postgresql
```

---

## 4. Clonar y Configurar el Proyecto

```bash
# Clonar repositorio
git clone https://github.com/montanocjose1/academia-digital-pro.git
cd academia-digital-pro

# Configurar backend Python
cd backend-python
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
nano .env
# Editar:
#   SECRET_KEY=tu-clave-secreta-aqui
#   JWT_SECRET_KEY=tu-jwt-secreto-aqui
#   DATABASE_URL=postgresql://academia_user:password_seguro_2026@localhost:5432/academia_digital_pro
#   FRONTEND_URL=https://montanocjose1.github.io/academia-digital-pro

# Inicializar base de datos
psql -U academia_user -d academia_digital_pro -f ../database/schema.sql

# O usando Python
python app.py
# La primera ejecución crea las tablas automáticamente
```

---

## 5. Configurar Frontend (Build)

```bash
# Volver a raíz del proyecto
cd ../frontend

# Instalar dependencias
npm install

# Construir para producción
npm run build

# El build se genera en frontend/dist/
# Para producción, el frontend se despliega en GitHub Pages
```

---

## 6. Configurar Nginx como Proxy Inverso

```bash
sudo nano /etc/nginx/sites-available/academia

# Contenido:
server {
    listen 80;
    server_name tu-dominio.com o IP_PUBLICA;

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend (si se sirve desde el mismo servidor)
    location / {
        root /var/www/academia-digital-pro;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}

# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/academia /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 7. Configurar Flask como Servicio Systemd

```bash
sudo nano /etc/systemd/system/academia-backend.service

# Contenido:
[Unit]
Description=Academia Digital Pro Backend
After=network.target postgresql.service

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/academia-digital-pro/backend-python
Environment="PATH=/home/ubuntu/academia-digital-pro/backend-python/venv/bin"
ExecStart=/home/ubuntu/academia-digital-pro/backend-python/venv/bin/gunicorn -w 4 -b 0.0.0.0:5000 app:app
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target

# Iniciar servicio
sudo systemctl daemon-reload
sudo systemctl start academia-backend
sudo systemctl enable academia-backend
sudo systemctl status academia-backend
```

---

## 8. Configurar HTTPS con Certbot

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtener certificado SSL
sudo certbot --nginx -d tu-dominio.com

# Renovación automática
sudo certbot renew --dry-run
```

---

## 9. Backup y Mantenimiento

```bash
# Backup de base de datos
pg_dump -U academia_user academia_digital_pro > backup_$(date +%Y%m%d).sql

# Backup automático (cron)
crontab -e
# Agregar:
0 3 * * * pg_dump -U academia_user academia_digital_pro > /home/ubuntu/backups/academia_$(date +\%Y\%m\%d).sql

# Logs del sistema
sudo journalctl -u academia-backend -f
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 10. Monitoreo

```bash
# Verificar health de la API
curl http://localhost:5000/api/health

# Monitorear recursos
htop
df -h
free -m

# Verificar conexión a BD
psql -U academia_user -d academia_digital_pro -c "SELECT count(*) FROM usuarios;"
```

---

## 11. Acceso Remoto Seguro

```bash
# Configurar SSH
sudo nano /etc/ssh/sshd_config
#   Port 2222 (cambiar puerto)
#   PermitRootLogin no
#   PasswordAuthentication no
#   PubkeyAuthentication yes

# Agregar clave pública
mkdir -p ~/.ssh
echo "tu-clave-publica" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Reiniciar SSH
sudo systemctl restart sshd

# Configurar firewall
sudo ufw allow 2222/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 12. Verificación Final

```bash
# Probar API
curl http://localhost:5000/api/health
# Respuesta esperada:
# {"status":"ok","version":"1.0.0","platform":"Academia Digital Pro"}

# Verificar base de datos
psql -U academia_user -d academia_digital_pro -c "\dt academia.*"

# Verificar frontend
# Acceder a: https://montanocjose1.github.io/academia-digital-pro/
# o http://tu-dominio.com

# Probar login con datos semilla:
#   Email: admin@academiapro.com
#   Password: admin123
```
