# BacaLab Frontend (Next.js)

Frontend del projecte de l'examen del bacalla, construida amb Next.js App Router.

## Requisits

- Node.js 20 o superior
- Una API Express desplegada o local amb aquests endpoints:
	- `GET /api/bacalla`
	- `GET /api/bacalla/:id`
	- `POST /api/bacalla` (si vols usar la pagina d'alta)

## Instal·lacio i execucio local

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Despres, obre `http://localhost:3000` al navegador.

## Variables d'entorn

Aquest frontend no porta URLs en dur: es configuren desde `src/services/urls.js` amb la variable:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

En produccio (Vercel), defineix la mateixa variable apuntant a la URL publica del backend.

## Rutes del frontend

- `/` -> llistat de varietats de bacalla
- `/varietats/[id]` -> detall d'una varietat
- `/nou` -> formulari client-side per donar d'alta una varietat

## Estructura rellevant

- `src/services/urls.js`: URL base i paths de l'API
- `src/services/bacallaService.js`: funcions `getVarietats`, `getVarietatById`, `createVarietat`
- `src/app/page.js`: llistat
- `src/app/varietats/[id]/page.jsx`: detall
- `src/app/nou/page.jsx` + `src/components/NewVarietatForm.jsx`: alta interactiva

## Scripts utiles

```bash
npm run dev
npm run lint
npm run build
```
