# `react-graph-router`

Implementation of with `react-router` using `graphology`.

## !! WIP !!

**This project is still a work in progress.**

## Background

Usual multi-step pages tend to be branching and having different functionalities such as moving to the next page and going back to a previous page.

Using directed graphs, this package will generate routes based on the current route's (or node's) segment (or directed path).

## Usage (suggested)

### Basic usage

```ts
// Instantiation
const featureRoutes = new GraphRouter([
  {
    id: "start",
    path: "/",
  },
  {
    id: "about",
    path: "/about",
  },
]);

featureRoutes.getPaths(); // ["/", "/about"];
```

### Multiple segments

You can also instantiate multiple segments and generate the segment, which can also be based on a node.

```ts
// Instantiation
const featureRoutes = new GraphRouter([
  {
    id: "admin-home",
    path: "/",
    segmentId: "admin",
  },
  {
    id: "login",
    path: "/login",
    segmentId: "admin",
  },
  {
    id: "dashboard",
    path: "/dashboard",
    segmentId: "admin",
  },
  {
    id: "user-landing",
    path: "/",
    segmentId: "user",
  },
  {
    id: "products",
    path: "/products",
    segmentId: "user",
  },
  {
    id: "contact",
    path: "/contact",
    segmentId: "user",
  },
]);

// Get the segment "user"
featureRoutes.getSegment({
  segmentId: "user",
});
// ["user-landing", "products", "contact"]

// Get the whole segment based on node
featureRoutes.getSegment({
  nodeId: "login",
});
// ["admin-home", "login", "dashboard"]

featureRoutes.getSegment({
  segmentId: "admin",
  nodeId: "products",
});
// Error: node "products" does not exist in segment "admin"
```

---

**TODO:**

`react`

- [ ] Create hook for using GraphRouter

`react-router`

- [ ] Auto-generate routes based on a current segment

`graphology`

- [ ] Instantiating (directed and undirected) edges between nodes
- [ ] Expose function for updating edges
- [ ] Expose function to add nodes and updating edges automatically based on the node
- [ ] Automatically generate a directed graph (segment) based on segment ID
- [ ] Expose functions that generate directed neighbors (based on node) that would be the "previous" and "next" nodes
