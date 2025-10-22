# 🚨 ACCIONES REQUERIDAS ANTES DE HACER PÚBLICO EL REPOSITORIO

Este documento contiene los pasos **CRÍTICOS** que debes seguir antes de hacer público tu repositorio de CrewShift.

## ⚠️ IMPORTANTE: Archivos con Credenciales

Actualmente, los archivos `environment.ts` y `environment.prod.ts` están siendo trackeados por Git y **contienen tus credenciales reales de Firebase**. Aunque estas credenciales son relativamente seguras (Firebase las protege mediante reglas de seguridad), es mejor práctica no exponerlas públicamente.

### Pasos para Remover Archivos Sensibles del Historial de Git

Ejecuta los siguientes comandos **EN ORDEN**:

```bash
# 1. Asegúrate de tener todos los cambios commiteados
git add .
git commit -m "Add security documentation and prepare for public release"

# 2. Remover los archivos del tracking de Git (pero mantenerlos localmente)
git rm --cached src/environments/environment.ts
git rm --cached src/environments/environment.prod.ts

# 3. Commit estos cambios
git commit -m "Remove environment files from version control"

# 4. OPCIONAL pero RECOMENDADO: Limpiar el historial de Git
# ADVERTENCIA: Esto reescribirá el historial. Solo si NO has pusheado a un remoto público
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch src/environments/environment.ts src/environments/environment.prod.ts" \
  --prune-empty --tag-name-filter cat -- --all

# 5. Si usaste filter-branch, fuerza el push (solo si el repo aún es privado)
git push origin --force --all
git push origin --force --tags
```

### Alternativa Más Simple (Si No Te Preocupa el Historial)

Si prefieres una solución más simple y no te importa que las credenciales estén en commits antiguos:

```bash
# 1. Remover del tracking
git rm --cached src/environments/environment.ts
git rm --cached src/environments/environment.prod.ts

# 2. Commit
git commit -m "Remove environment files from version control"

# 3. Los archivos seguirán en tu disco pero no en futuros commits
```

## 🔒 Configuración de Seguridad en Firebase

Antes de hacer el repositorio público, **DEBES** configurar estas protecciones en Firebase Console:

### 1. Restricciones de Dominio (Authentication)

- Ve a Firebase Console → Authentication → Settings
- En "Authorized domains", asegúrate de que SOLO están:
  - `localhost` (para desarrollo)
  - Tu dominio de producción
- **Elimina** cualquier dominio `*.web.app` o `*.firebaseapp.com` si no los usas

### 2. Firestore Security Rules

Ya he creado el archivo `firestore.rules` con reglas de seguridad. **Aplícalas**:

```bash
# Si tienes Firebase CLI instalado:
firebase deploy --only firestore:rules

# O copia manualmente el contenido de firestore.rules a Firebase Console:
# Firebase Console → Firestore Database → Rules
```

### 3. App Check (Altamente Recomendado)

- Ve a Firebase Console → App Check
- Habilita App Check para tu app web
- Configura reCAPTCHA v3
- Esto protegerá tu app de abuso y bots

## 📋 Checklist Pre-Publicación

Marca cada ítem antes de hacer el repositorio público:

### Archivos y Configuración

- [ ] Archivos `environment.ts` y `environment.prod.ts` removidos del tracking de Git
- [ ] Archivo `.gitignore` actualizado (ya hecho ✅)
- [ ] Archivo `environment.example.ts` creado (ya hecho ✅)
- [ ] No hay datos personales en el código (correos, nombres, etc.)
- [ ] Carpeta `miscellaneous` está ignorada (ya hecho ✅)

### Documentación

- [ ] README.md actualizado con instrucciones completas (ya hecho ✅)
- [ ] LICENSE agregado (MIT) (ya hecho ✅)
- [ ] SECURITY.md creado (ya hecho ✅)
- [ ] CONTRIBUTING.md creado (ya hecho ✅)
- [ ] Actualiza el URL del repositorio en README.md (línea 51)

### Firebase Security

- [ ] Firestore Security Rules aplicadas
- [ ] Dominios autorizados configurados
- [ ] App Check habilitado (recomendado)
- [ ] Reglas de Storage configuradas (si usas Storage)

### Testing Final

- [ ] La aplicación funciona correctamente en local
- [ ] Las pruebas pasan (`npm test`)
- [ ] Build de producción exitoso (`npm run build`)
- [ ] No hay errores en la consola del navegador

## 🎨 Mejoras Opcionales (Pero Recomendadas)

### Screenshots

Agrega screenshots a tu README para hacerlo más atractivo:

1. Toma capturas de pantalla de:

   - Vista del calendario principal
   - Modal de configuración
   - Selector de equipos
   - Vista de estadísticas

2. Crea una carpeta `.github/screenshots/` o `docs/images/`

3. Actualiza el README agregando las imágenes después de la descripción

### GitHub Repository Settings

Una vez hagas el repo público:

- [ ] Agrega topics/tags: `angular`, `typescript`, `firebase`, `calendar`, `shift-work`, `primeng`
- [ ] Agrega una descripción breve del proyecto
- [ ] Configura GitHub Pages si quieres demo en vivo
- [ ] Habilita Issues y Discussions
- [ ] Configura branch protection rules para `master`

### CI/CD (Opcional)

Considera agregar GitHub Actions para:

- Tests automáticos en cada PR
- Build automático
- Deploy automático a Firebase Hosting

## 🚀 Pasos para Hacer Público el Repositorio

Una vez completado TODO lo anterior:

1. En GitHub, ve a Settings del repositorio
2. Scroll hasta "Danger Zone"
3. Click en "Change visibility"
4. Selecciona "Make public"
5. Confirma escribiendo el nombre del repositorio

## 📞 Soporte Post-Publicación

Después de hacer público el repositorio:

1. **Monitorea Issues**: Revisa regularmente las issues que abran usuarios
2. **Actualiza Dependencias**: Ejecuta `npm audit` mensualmente
3. **Responde a PRs**: Revisa y responde a pull requests de la comunidad
4. **Documenta Cambios**: Usa un CHANGELOG.md para versiones futuras

## ⚡ Resumen de Archivos Creados/Modificados

He realizado los siguientes cambios en tu repositorio:

### Archivos Nuevos Creados:

- ✅ `LICENSE` - Licencia MIT
- ✅ `SECURITY.md` - Política de seguridad
- ✅ `CONTRIBUTING.md` - Guía para contribuidores
- ✅ `firestore.rules` - Reglas de seguridad de Firestore
- ✅ `src/environments/environment.example.ts` - Template de configuración
- ✅ `PRE_RELEASE_CHECKLIST.md` - Este archivo

### Archivos Modificados:

- ✅ `README.md` - Documentación completa y profesional
- ✅ `.gitignore` - Actualizado para ignorar archivos environment

### Próximos Pasos Manuales:

1. Remover `environment.ts` y `environment.prod.ts` del historial de Git
2. Aplicar las Firestore Security Rules en Firebase Console
3. Configurar restricciones de dominio en Firebase
4. Actualizar URL del repositorio en README.md
5. Agregar screenshots (opcional)
6. Hacer el repositorio público

---

**¿Dudas?** Si necesitas ayuda con algún paso, no dudes en preguntar antes de proceder.
