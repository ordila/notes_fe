# GraphQL Notes Frontend

Frontend application for note management built with React and GraphQL.

## Technologies

- React
- GraphQL
- Apollo Client
- TypeScript


## Installation

```bash
npm install
```

## Running the Project

To start the development server:

```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm start` - Start development server
- `npm test` - Run tests
- `npm run build` - Build for production
- `npm run eject` - Remove Create React App configuration

## Project Structure

```
src/
  ├── components/     # React components
  ├── graphql/       # GraphQL queries and mutations
  ├── types/         # TypeScript types
  └── App.tsx        # Main component
```

## Backend Integration

The frontend interacts with a GraphQL backend that provides the following operations:

- Get all notes
- Get single note
- Create note
- Update note
- Delete note
