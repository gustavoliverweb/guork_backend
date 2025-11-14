import swaggerJSDoc from "swagger-jsdoc";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const PORT = process.env.PORT || 3000;
const API_NAME = process.env.API_NAME || "api";
const API_VERSION = process.env.API_VERSION || "v1";
const BASE_PATH = `/${API_NAME}/${API_VERSION}`;
const serverUrl = process.env.SWAGGER_SERVER_URL;
const serverDesc = process.env.SWAGGER_SERVER_DESC;

const servers = [
  {
    url: `http://localhost:${PORT}${BASE_PATH}`,
    description: "Development server",
  },
  ...(serverUrl
    ? [
        {
          url: serverUrl,
          description: serverDesc || "Custom server",
        },
      ]
    : []),
];

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Guork API",
      version: "1.0.0",
      description: "API documentation for Guork Backend",
    },
    servers,
    tags: [
      {
        name: "Auth",
        description: "Authentication operations",
      },
      {
        name: "Users",
        description: "User management operations",
      },
      {
        name: "Profiles",
        description: "Profiles management operations",
      },
      {
        name: "Requests",
        description: "Requests management operations",
      },
      {
        name: "Assignments",
        description: "Assignments management operations",
      },
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          $ref: "../modules/users/schemas/usersSwaggerSchema.yml#/User",
        },
        CreateUser: {
          $ref: "../modules/users/schemas/usersSwaggerSchema.yml#/CreateUser",
        },
        UpdateUser: {
          $ref: "../modules/users/schemas/usersSwaggerSchema.yml#/UpdateUser",
        },
        Login: {
          $ref: "../modules/auth/schemas/authSwaggerSchema.yml#/Login",
        },
        AuthResponse: {
          $ref: "../modules/auth/schemas/authSwaggerSchema.yml#/AuthResponse",
        },
        Profile: {
          $ref: "../modules/profiles/schemas/profilesSwaggerSchema.yml#/Profile",
        },
        CreateProfile: {
          $ref: "../modules/profiles/schemas/profilesSwaggerSchema.yml#/CreateProfile",
        },
        UpdateProfile: {
          $ref: "../modules/profiles/schemas/profilesSwaggerSchema.yml#/UpdateProfile",
        },
        Request: {
          $ref: "../modules/requests/schemas/requestsSwaggerSchema.yml#/Request",
        },
        CreateRequest: {
          $ref: "../modules/requests/schemas/requestsSwaggerSchema.yml#/CreateRequest",
        },
        UpdateRequest: {
          $ref: "../modules/requests/schemas/requestsSwaggerSchema.yml#/UpdateRequest",
        },
        Assignment: {
          $ref: "../modules/assignments/schemas/assignmentsSwaggerSchema.yml#/Assignment",
        },
        CreateAssignment: {
          $ref: "../modules/assignments/schemas/assignmentsSwaggerSchema.yml#/CreateAssignment",
        },
        UpdateAssignment: {
          $ref: "../modules/assignments/schemas/assignmentsSwaggerSchema.yml#/UpdateAssignment",
        },
      },
    },
  },
  apis: [
    "src/modules/auth/*.ts",
    "src/modules/users/*.ts",
    "src/modules/profiles/*.ts",
    "src/modules/requests/*.ts",
    "src/modules/assignments/*.ts",
  ],
};

export const swaggerSpecs = swaggerJSDoc(options);
