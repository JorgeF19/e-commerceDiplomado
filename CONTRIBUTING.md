# Guía de Contribución

¡Gracias por tu interés en contribuir al proyecto e-commerce Diplomado! 

## 🤝 Cómo Contribuir

### 1. Fork del repositorio
- Haz fork del repositorio a tu cuenta de GitHub
- Clona tu fork localmente:
```bash
git clone https://github.com/tu-usuario/e-commerceDiplomado.git
cd e-commerceDiplomado
```

### 2. Configurar el entorno de desarrollo

#### Backend:
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

#### Frontend:
```bash
cd frontend-react
npm install
npm start
```

### 3. Crear una rama para tu feature
```bash
git checkout -b feature/nombre-de-tu-feature
```

### 4. Estilo de código

#### Python (Backend):
- Seguir PEP 8
- Usar type hints
- Documentar funciones con docstrings
- Nombres descriptivos en inglés

#### JavaScript/React (Frontend):
- Usar ES6+
- Componentes funcionales con hooks
- Props y estados con nombres descriptivos
- Comentarios en español para lógica compleja

### 5. Commits
- Usar mensajes descriptivos
- Formato: `tipo: descripción`
- Tipos: feat, fix, docs, style, refactor, test

Ejemplo:
```
feat: agregar filtro por precio en productos
fix: corregir error en autenticación JWT
docs: actualizar README con nuevas instrucciones
```

### 6. Pull Request
- Actualizar documentación si es necesario
- Asegurar que todos los tests pasen
- Describir claramente los cambios realizados

## 🐛 Reportar Bugs

1. Verificar que el bug no haya sido reportado antes
2. Crear un issue con:
   - Descripción clara del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots si es aplicable
   - Información del entorno (OS, browser, versiones)

## 💡 Sugerir Features

1. Crear un issue con etiqueta "enhancement"
2. Describir claramente la funcionalidad propuesta
3. Explicar por qué sería útil
4. Considerar alternativas de implementación

## 📋 Checklist para Pull Requests

- [ ] El código funciona correctamente
- [ ] Se agregaron tests para nuevas funcionalidades
- [ ] La documentación está actualizada
- [ ] El código sigue las convenciones del proyecto
- [ ] No hay warnings o errores de linting
- [ ] Los commits tienen mensajes descriptivos
- [ ] Se probó en diferentes navegadores (frontend)

## 🧪 Testing

### Backend:
```bash
pytest backend/tests/
```

### Frontend:
```bash
cd frontend-react
npm test
```

## 📞 Contacto

Si tienes preguntas sobre contribuciones:
- Crear un issue con etiqueta "question"
- Contactar al mantenedor: [@JorgeF19](https://github.com/JorgeF19)

## 🎯 Areas donde puedes contribuir

- **Frontend**: Mejorar UI/UX, agregar animaciones, optimizar performance
- **Backend**: Optimizar queries, agregar endpoints, mejorar seguridad
- **Testing**: Escribir pruebas unitarias e integración
- **Documentación**: Mejorar README, agregar tutoriales
- **DevOps**: Docker, CI/CD, despliegue

¡Toda contribución es bienvenida! 🚀