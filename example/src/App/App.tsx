import React, { Fragment } from "react";

import { GraphRouter } from "../../../src/index";

enum Feature {
  One = "isa", // 1 in Filipino
  Two = "to", // 2 in Norwegian
  Three = "trois", // 3 in French
}

export const App = () => {
  const featureRouter = new GraphRouter();
  featureRouter.graphRoutes = [
    {
      id: Feature.One,
      path: "/uno",
      component: null,
    },
    {
      id: Feature.Two,
      path: "/dos",
      component: null,
    },
    {
      id: Feature.Three,
      path: "/tres",
      component: null,
    },
  ];

  featureRouter.init();

  return (
    <>
      {featureRouter.getPaths().map((path) => (
        <Fragment key={path}>
          {`<Route path="${path}" />`}
          <br />
        </Fragment>
      ))}
    </>
  );
};
