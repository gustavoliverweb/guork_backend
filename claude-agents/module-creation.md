# Guía para la Creación de Módulos Backend

Esta guía define el estándar para crear módulos en el backend siguiendo una arquitectura limpia y modular basada en el módulo de `users` como referencia.

## Estructura de Carpetas

```
src/modules/
└── moduleName/ (plural, camelCase)
    ├── models/
    │   └── moduleNameModel.ts (singular, camelCase + Model suffix)
    ├── schemas/
    │   ├── moduleNameZodSchema.ts (validaciones Zod)
    │   └── moduleNameSwaggerSchema.yml (documentación Swagger)
    ├── moduleNameTypes.ts (interfaces TypeScript)
    ├── moduleNameRepository.ts (acceso a datos)
    ├── moduleNameService.ts (lógica de negocio)
    ├── moduleNameController.ts (manejo de HTTP)
    └── moduleNameRoutes.ts (definición de rutas)
```

### Convenciones de Nomenclatura

- **Carpetas**: Nombres en plural y camelCase (ej: `users`, `products`, `orders`)
- **Archivos de modelo**: Singular + `Model.ts` (ej: `userModel.ts`, `productModel.ts`)
- **Otros archivos**: `moduleName` + tipo (ej: `usersRepository.ts`, `usersService.ts`)
- **Exports por defecto**: Para modelos y routers
- **Exports nombrados**: Para clases de Repository, Service y Controller

## 1. Modelo (Model)

**Ubicación**: `models/moduleNameModel.ts`

**Características**:
- Usa `sequelize-typescript` con decoradores
- Propiedades en camelCase que mapean a columnas snake_case en la BD
- IDs siempre son UUID
- Todas las relaciones se definen en el modelo con decoradores
- Incluye timestamps automáticos con `underscored: true`

**Ejemplo**:
```typescript
import { Table, Column, Model, DataType, PrimaryKey, HasMany, BelongsTo, ForeignKey } from "sequelize-typescript";
import { UUIDV4 } from "sequelize";

@Table({ tableName: "users", timestamps: true, underscored: true })
export default class UserModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: UUIDV4, allowNull: false })
  id!: string;

  @Column({ type: DataType.TEXT, allowNull: false, field: "first_name" })
  firstName!: string;

  @Column({ type: DataType.TEXT, allowNull: false, unique: true })
  email!: string;

  // Relaciones
  @HasMany(() => SessionModel)
  sessions!: SessionModel[];

  @ForeignKey(() => OtherModel)
  @Column({ type: DataType.UUID, allowNull: false, field: "other_id" })
  otherId!: string;

  @BelongsTo(() => OtherModel)
  other!: OtherModel;

  // Método para excluir campos sensibles de la respuesta
  toJSON() {
    const values = { ...this.get() } as any;
    delete values.password; // Si aplica
    return values;
  }
}
```

**Tipos de datos**:
- Strings: `DataType.TEXT`
- IDs: `DataType.UUID` con `defaultValue: UUIDV4`
- Fechas: `DataType.DATE`
- Booleanos: `DataType.BOOLEAN`
- Números: `DataType.INTEGER` o `DataType.FLOAT`

## 2. Types (TypeScript Interfaces)

**Ubicación**: `moduleNameTypes.ts`

**Características**:
- Define interfaces para atributos, creación y respuestas
- Usa camelCase para todas las propiedades

**Ejemplo**:
```typescript
export interface UserAttributes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "user" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes
  extends Omit<UserAttributes, "id" | "createdAt" | "updatedAt"> {}

export interface UserResponse
  extends Omit<UserAttributes, "password" | "createdAt" | "updatedAt"> {}
```

## 3. Schemas de Validación (Zod)

**Ubicación**: `schemas/moduleNameZodSchema.ts`

**Características**:
- Valida solo campos requeridos y opcionales según reglas de negocio
- Exporta tipos inferidos de los schemas
- Usa camelCase para propiedades

**Ejemplo**:
```typescript
import { z } from "zod";

export const createUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"]).optional(),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.enum(["user", "admin"]).optional(),
});

// Tipos inferidos
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
```

## 4. Schemas de Swagger (YAML)

**Ubicación**: `schemas/moduleNameSwaggerSchema.yml`

**Características**:
- Define schemas en formato YAML para Swagger
- Incluye schemas para entidades, creación y actualización
- Usa camelCase para propiedades

**Ejemplo**:
```yaml
User:
  type: object
  properties:
    id:
      type: string
      format: uuid
    firstName:
      type: string
    lastName:
      type: string
    email:
      type: string
      format: email
    role:
      type: string
      enum: [user, admin]

CreateUser:
  type: object
  required:
    - firstName
    - lastName
    - email
    - password
  properties:
    firstName:
      type: string
    lastName:
      type: string
    email:
      type: string
      format: email
    password:
      type: string
      minLength: 6
    role:
      type: string
      enum: [user, admin]
      default: user

UpdateUser:
  type: object
  properties:
    firstName:
      type: string
    lastName:
      type: string
    email:
      type: string
      format: email
    role:
      type: string
      enum: [user, admin]
```

## 5. Repository (Capa de Datos)

**Ubicación**: `moduleNameRepository.ts`

**Características**:
- Maneja CRUD básico de la base de datos
- Métodos asíncronos con async/await
- Retorna modelos de Sequelize o null

**Ejemplo**:
```typescript
import UserModel from "./models/userModel";
import { UserCreationAttributes } from "./usersTypes";

export class UserRepository {
  async create(data: UserCreationAttributes): Promise<UserModel> {
    return await UserModel.create(data);
  }

  async findAll(): Promise<UserModel[]> {
    return await UserModel.findAll();
  }

  async findById(id: string): Promise<UserModel | null> {
    return await UserModel.findByPk(id);
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    return await UserModel.findOne({ where: { email } });
  }

  async update(id: string, data: Partial<UserCreationAttributes>): Promise<UserModel | null> {
    const record = await UserModel.findByPk(id);
    if (!record) return null;
    return await record.update(data);
  }

  async delete(id: string): Promise<boolean> {
    const record = await UserModel.findByPk(id);
    if (!record) return false;
    await record.destroy();
    return true;
  }
}
```

## 6. Service (Lógica de Negocio)

**Ubicación**: `moduleNameService.ts`

**Características**:
- Contiene la lógica de negocio
- Usa Repository para acceder a datos
- Lanza errores con `throw new Error()` para manejo en Controller
- Convierte modelos a tipos de respuesta

**Ejemplo**:
```typescript
import { UserRepository } from "./usersRepository";
import { CreateUserInput, UpdateUserInput } from "./schemas/usersZodSchema";
import { UserResponse } from "./usersTypes";
import bcrypt from "bcrypt";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  private userToResponse(user: any): UserResponse {
    const { password, createdAt, updatedAt, ...userResponse } = user.toJSON();
    return userResponse;
  }

  async createUser(data: CreateUserInput): Promise<UserResponse> {
    // Validaciones de negocio
    const existingEmail = await this.userRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new Error("Email already exists");
    }

    // Lógica adicional (ej: hash de password)
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
      role: data.role || "user",
    });

    return this.userToResponse(user);
  }

  async getAllUsers(): Promise<UserResponse[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => this.userToResponse(user));
  }

  async getUserById(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return this.userToResponse(user);
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<UserResponse> {
    const user = await this.userRepository.update(id, data);
    if (!user) {
      throw new Error("User not found");
    }
    return this.userToResponse(user);
  }

  async deleteUser(id: string): Promise<void> {
    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new Error("User not found");
    }
  }
}
```

## 7. Controller (Manejo de HTTP)

**Ubicación**: `moduleNameController.ts`

**Características**:
- Maneja requests y responses HTTP
- Valida datos con Zod
- Usa Service para lógica de negocio
- Maneja errores y retorna códigos de estado apropiados
- Métodos como arrow functions para mantener contexto `this`

**Ejemplo**:
```typescript
import { Request, Response } from "express";
import { UserService } from "./usersService";
import { createUserSchema, updateUserSchema } from "./schemas/usersZodSchema";
import { ZodError } from "zod";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = createUserSchema.parse(req.body);
      const user = await this.userService.createUser(validatedData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ errors: error.issues });
        return;
      }
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  };

  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  };

  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  };

  updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const validatedData = updateUserSchema.parse(req.body);
      const user = await this.userService.updateUser(id, validatedData);
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ errors: error.issues });
        return;
      }
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.userService.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  };
}
```

**Códigos de estado HTTP**:
- `200`: Operación exitosa (GET, PUT)
- `201`: Recurso creado exitosamente (POST)
- `204`: Operación exitosa sin contenido (DELETE)
- `400`: Error de validación o datos inválidos
- `401`: No autorizado (sin token o token inválido)
- `404`: Recurso no encontrado
- `500`: Error interno del servidor

## 8. Routes (Definición de Rutas)

**Ubicación**: `moduleNameRoutes.ts`

**Características**:
- Define rutas HTTP
- Aplica middlewares (ej: `authMiddleware`)
- Documenta endpoints con JSDoc para Swagger
- Referencia schemas desde archivos YAML

**Ejemplo**:
```typescript
import { Router } from "express";
import { UserController } from "./usersController";
import { authMiddleware } from "../../shared/middlewares/authMiddleware";

const router = Router();
const userController = new UserController();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input or user already exists
 *       401:
 *         description: Unauthorized
 */
router.post("/", authMiddleware, userController.createUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware, userController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get("/:id", authMiddleware, userController.getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.put("/:id", authMiddleware, userController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.delete("/:id", authMiddleware, userController.deleteUser);

export default router;
```

## Pasos para Crear un Nuevo Módulo

### 1. Crear la estructura de carpetas
```bash
mkdir -p src/modules/moduleName/models
mkdir -p src/modules/moduleName/schemas
```

### 2. Crear el modelo
- Crear `models/moduleNameModel.ts`
- Usar decoradores de sequelize-typescript
- Definir relaciones con otros modelos
- Mapear camelCase a snake_case

### 3. Crear las interfaces TypeScript
- Crear `moduleNameTypes.ts`
- Definir interfaces: Attributes, CreationAttributes, Response

### 4. Crear la migración
```bash
npx sequelize-cli migration:generate --name create-module-name-table
```
- Asegurarse que las columnas estén en snake_case
- Definir foreign keys con CASCADE si aplica
- Agregar índices para campos únicos

### 5. Crear schemas de validación
- Crear `schemas/moduleNameZodSchema.ts` con validaciones Zod
- Crear `schemas/moduleNameSwaggerSchema.yml` con schemas para Swagger
- Exportar tipos inferidos de Zod

### 6. Crear Repository
- Crear `moduleNameRepository.ts`
- Implementar métodos CRUD básicos
- Agregar métodos de búsqueda específicos si es necesario

### 7. Crear Service
- Crear `moduleNameService.ts`
- Implementar lógica de negocio
- Usar Repository para acceso a datos
- Manejar conversiones de tipo

### 8. Crear Controller
- Crear `moduleNameController.ts`
- Validar datos con Zod
- Llamar métodos del Service
- Manejar errores apropiadamente

### 9. Crear Routes
- Crear `moduleNameRoutes.ts`
- Definir endpoints con métodos HTTP
- Aplicar `authMiddleware` donde sea necesario
- Documentar cada endpoint con JSDoc para Swagger

### 10. Registrar el modelo
Agregar el modelo a `src/config/database.ts`:
```typescript
import ModuleNameModel from "../modules/moduleName/models/moduleNameModel";

const models = [UserModel, SessionModel, ModuleNameModel];
```

### 11. Registrar las rutas
Agregar las rutas a `src/app.ts`:
```typescript
import moduleNameRoutes from "./modules/moduleName/moduleNameRoutes";

app.use("/module-name", moduleNameRoutes);
```

### 12. Registrar schemas en Swagger
Agregar referencia en `src/config/swagger.ts`:
```typescript
components: {
  schemas: {
    ModuleName: {
      $ref: "../../modules/moduleName/schemas/moduleNameSwaggerSchema.yml#/ModuleName",
    },
    CreateModuleName: {
      $ref: "../../modules/moduleName/schemas/moduleNameSwaggerSchema.yml#/CreateModuleName",
    },
    UpdateModuleName: {
      $ref: "../../modules/moduleName/schemas/moduleNameSwaggerSchema.yml#/UpdateModuleName",
    },
  },
}
```

Y agregar el archivo a `apis`:
```typescript
apis: [
  "src/modules/auth/*.ts",
  "src/modules/users/*.ts",
  "src/modules/moduleName/*.ts",
],
```

### 13. Ejecutar migraciones
```bash
npx sequelize-cli db:migrate
```

### 14. Probar el módulo
- Iniciar el servidor: `npm run dev`
- Probar endpoints en Swagger UI: `http://localhost:3000/api-docs`
- Verificar autenticación con Bearer token si aplica

## Buenas Prácticas

1. **Nomenclatura consistente**: Usar camelCase en código, snake_case en base de datos
2. **Validación en capas**: Zod en Controller, lógica de negocio en Service
3. **Manejo de errores**: Usar `throw new Error()` en Service, capturar en Controller
4. **Seguridad**: Aplicar `authMiddleware` en rutas protegidas
5. **Documentación**: Mantener Swagger actualizado para cada endpoint
6. **Tipos fuertes**: Usar TypeScript interfaces y tipos inferidos de Zod
7. **Separación de responsabilidades**: Repository para datos, Service para lógica, Controller para HTTP
8. **IDs UUID**: Siempre usar UUID v4 para identificadores
9. **Relaciones en modelos**: Definir todas las relaciones con decoradores en los modelos
10. **Exclusión de campos sensibles**: Usar `toJSON()` en modelos para excluir campos como passwords
