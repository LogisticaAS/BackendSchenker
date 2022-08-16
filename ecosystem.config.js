module.exports = {
  apps: [
    {
      script: "./src/index.js",
      name: "aduanaSoft",
      watch: "src",
      ignore_watch: "src/files",
      env: {
        NODE_ENV: "development",
        DATABASE: "aduanasoft",
        DATABASE_USER: "root",
        PASSWORD: "",
        PORT: "3306",
      },
      env_production: {
        NODE_ENV: "",
        DATABASE: "",
        DATABASE_USER: "",
        PASSWORD: "",
        CORREOS: [],
        PORT: "",
      },
    },
  ],
};
