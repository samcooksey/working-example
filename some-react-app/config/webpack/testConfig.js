const c = require("ansi-colors");
const log = require("fancy-log");
const { forEach, isEmpty, map } = require("lodash");
const { merge } = require("webpack-merge");
const webpack = require("webpack");
const { getStyleLoaderRule, hardSourceWebpackPlugin } = require("./parts");
const conf = require("../gulp.conf");

// Plugin to show any webpack errors and prevent tests from running
// see: https://gist.github.com/Stuk/6b574049435df532e905
function FailOnWebpackErrors(singleRun) {
  const _this = this;
  this.singleRun = singleRun;
  this.apply = function (compiler) {
    compiler.hooks.done.tap("FailOnWebpackErrors", function (stats) {
      if (!isEmpty(stats.compilation.errors)) {
        // Log each of the errors
        forEach(
          map(stats.compilation.errors, function (error) {
            return error.message || error;
          }),
          function (error) {
            log.error(error);
          },
        );

        log.error(c.red("If you are seeing this, bootstrapping the application for tests failed!"));

        // Pretend no assets were generated. This prevents the tests
        // from running making it clear that there were errors.
        stats.stats = [
          {
            toJson: function () {
              return this;
            },
            assets: [],
          },
        ];

        if (_this.singleRun) {
          process.exit(1);
        }
      }
    });
  };
}

module.exports = (env) =>
  merge(
    {
      module: {
        rules: [
          {
            test: /\.(tsx?|js)$/i,
            enforce: "post",
            use: [
              {
                loader: "istanbul-instrumenter-loader",
                options: {
                  esModules: true,
                },
              },
            ],
            include: conf.path.src(),
          },
        ],
      },
      plugins: [
        new webpack.NormalModuleReplacementPlugin(/dojo\/request$/, conf.path.node_modules("dojo/request/registry.js")),
        new FailOnWebpackErrors(env.singleRun),
      ],
      resolve: {
        alias: {
          "src/admin/services/FlagshipIntegrationService": conf.path.test(
            "mocks/admin/services/FlagshipIntegrationServiceMock",
          ),
          "src/admin/services/PlanningSettingsService": conf.path.test(
            "mocks/admin/services/PlanningSettingsServiceMock",
          ),
          "src/admin/services/UpgradePlanService": conf.path.test("mocks/admin/services/UpgradePlanServiceMock"),
          "src/container/containerApi/Features": conf.path.test("mocks/container/containerApi/FeaturesMock"),
          "src/container/containerApi/applicationRegistrar": conf.path.test(
            "mocks/container/containerApi/ApplicationRegistrarMock",
          ),
          "src/container/containerApi/navigator": conf.path.test("mocks/container/containerApi/NavigatorMock"),
          "src/container/containerApi/notifier": conf.path.test("mocks/container/containerApi/NotifierMock"),
          "src/container/containerApi/userContext": conf.path.test("mocks/container/containerApi/UserContextMock"),
          "src/framework/metamodel/MetaDataService": conf.path.test("mocks/planning/services/metaDataServiceMock"),
          "src/framework/queries/BaseQuery": conf.path.test("mocks/libs/framework/queries/BaseQueryMock"),
          "src/framework/services/LoggerService": conf.path.test("mocks/framework/services/LoggerService"),
          "src/framework/settings/SettingsService": conf.path.test("mocks/libs/framework/settings/SettingsServiceMock"),
          "src/framework/widgets/table/pickListStore": conf.path.test(
            "mocks/libs/framework/widgets/table/pickListStoreMock",
          ),
          "src/planning/PlanningStore": conf.path.test("mocks/planning/PlanningStoreMock"),
          "src/planning/notifications/planningNotificationPoller": conf.path.test(
            "mocks/planning/notifications/planningNotificationPollerMock",
          ),
          "src/planning/services/EnvironmentService": conf.path.test("mocks/planning/services/EnvironmentServiceMock"),
          "src/planning/services/LineItemService": conf.path.test("mocks/planning/services/lineItemServiceMock"),
          "src/planning/services/PlanCompareShortcutService": conf.path.test(
            "mocks/planning/services/PlanCompareShortcutServiceMock",
          ),
          "src/planning/services/PlanReportService": conf.path.test("mocks/planning/services/planReportServiceMock"),
          "src/planning/services/PlanService": conf.path.test("mocks/planning/services/planServiceMock"),
          "src/planning/services/PlanSettingsService": conf.path.test(
            "mocks/planning/services/planSettingsServiceMock",
          ),
          "src/planning/services/PlanStatusService": conf.path.test("mocks/planning/services/planStatusServiceMock"),
          "src/planning/services/SubPlanService": conf.path.test("mocks/planning/services/subPlanServiceMock"),
          "src/planning/services/TopNavService": conf.path.test("mocks/planning/services/TopNavServiceMock"),
          "src/planning/services/UserService": conf.path.test("mocks/planning/services/UserServiceMock"),
          "src/planning/services/placesService": conf.path.test("mocks/planning/services/placesServiceMock"),
          "src/planning/services/planningService": conf.path.test("mocks/planning/services/planningServiceMock"),
          "src/planning/services/targetsService": conf.path.test("mocks/planning/services/targetsServiceMock"),
          "src/refData/services/AgileDimensionService": conf.path.test(
            "mocks/refData/services/agileDimensionServiceMock",
          ),
          "src/refData/services/DimensionService": conf.path.test("mocks/refData/services/DimensionServiceMock"),
          "src/refData/services/contractVatRateService": conf.path.test(
            "mocks/refData/services/contractVatRateServiceMock",
          ),
          "src/refData/services/CostObjectPermissionService": conf.path.test(
            "mocks/refData/services/costObjectPermissionServiceMock",
          ),
          "src/refData/services/currencyRateService": conf.path.test("mocks/refData/services/currencyRateServiceMock"),
          "src/refData/services/rateService": conf.path.test("mocks/refData/services/rateServiceMock"),
          "src/refData/services/ruleService": conf.path.test("mocks/refData/services/ruleServiceMock"),
          "src/spendMgmt/services/actualsStatusService": conf.path.test(
            "mocks/spendMgmt/services/actualsStatusServiceMock",
          ),
          "src/spendMgmt/services/costObjectService": conf.path.test("mocks/spendMgmt/services/costObjectServiceMock"),
          unmock: conf.path.src(),
          test: conf.path.test(),
        },
      },
    },
    hardSourceWebpackPlugin,
    getStyleLoaderRule(),
  );
