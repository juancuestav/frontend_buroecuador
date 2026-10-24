---
description: Genera y crea un commit siguiendo la convención del proyecto (gitmoji + qué/por qué)
---

Revisa los cambios pendientes (`git status`, `git diff`, `git diff --staged`) y el
historial reciente (`git log --oneline -15`).

Redacta el mensaje de commit siguiendo la convención de "Convención de commits" en
CLAUDE.md: `tipo(scope-opcional): :emoji: Descripción corta en español`, con cuerpo que
explique el qué y el porqué cuando el cambio lo amerite.

No uses `git add -A` ni `git add .` — agrega archivos específicos. Si hay algo que no
debería incluirse (secretos, binarios, archivos fuera de alcance), avisa antes de seguir.

Crea el commit con la línea de atribución que corresponda según las instrucciones
vigentes de la sesión.
