export default ({ config }) => {
  // APP_ENV is set by EAS build profiles, defaults to 'development' for local
  const environment = process.env.APP_ENV || "development";

  // Define API URLs for each environment
  const apiUrls = {
    development: "http://localhost:8080/api", // Gets replaced at runtime in client.ts for physical devices
    preview: "https://api.society.projectvanta.xyz/api",
    production: "https://api.society.projectvanta.xyz/api",
  };

  return {
    ...config,
    extra: {
      ...config.extra,
      apiUrl: apiUrls[environment],
      environment: environment,
    },
  };
};
