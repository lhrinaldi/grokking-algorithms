import { expect, test } from "vitest";
import { graph } from ".";

test("add vertices to graph", () => {
  const g = graph();

  g.add_vertex("A").add_vertex("B");

  expect(g.toString()).toBe("A,B");
  expect(g.get_vertex("A")?.[0]).toEqual("A");
  expect(g.get_vertex("B")?.[0]).toEqual("B");
});

test("add edges to undirected graph", () => {
  const g = graph();

  const vertex_a = "A";
  const vertex_b = "B";

  g.add_edge(vertex_a, vertex_b);

  expect(g.get_vertices().length).toBe(2);
  expect(g.get_vertices()[0]?.[0]).toEqual(vertex_a);
  expect(g.get_vertices()[1]?.[0]).toEqual(vertex_b);

  const g_vertex_a = g.get_vertex(vertex_a);
  const g_vertex_b = g.get_vertex(vertex_b);

  expect(g.toString()).toBe("A,B");
  expect(g_vertex_a).toBeDefined();
  expect(g_vertex_b).toBeDefined();

  expect(g.get_vertex("not existing")).toBeUndefined();

  const g_vertex_a_neighbors = g_vertex_a?.[1];
  const g_vertex_b_neighbors = g_vertex_b?.[1];

  expect(g_vertex_a_neighbors?.length).toBe(1);
  expect(g_vertex_a_neighbors?.[0]).toEqual(vertex_b);
  expect(g_vertex_a_neighbors?.[0]).toEqual(g_vertex_b?.[0]);

  expect(g_vertex_b_neighbors?.length).toBe(1);
  expect(g_vertex_b_neighbors?.[0]).toEqual(vertex_a);
  expect(g_vertex_b_neighbors?.[0]).toEqual(g_vertex_a?.[0]);
});

test("add edges to directed graph", () => {
  const g = graph(true);

  const vertex_a = "A";
  const vertex_b = "B";

  g.add_edge(vertex_a, vertex_b);

  const g_vertex_a = g.get_vertex(vertex_a);
  const g_vertex_b = g.get_vertex(vertex_b);

  expect(g.toString()).toBe("A,B");
  expect(g_vertex_a).toBeDefined();
  expect(g_vertex_b).toBeDefined();

  const g_vertex_a_neighbors = g_vertex_a?.[1];
  const g_vertex_b_neighbors = g_vertex_b?.[1];

  expect(g_vertex_a_neighbors?.length).toBe(1);
  expect(g_vertex_a_neighbors?.[0]).toEqual(vertex_b);
  expect(g_vertex_a_neighbors?.[0]).toEqual(g_vertex_b?.[0]);

  expect(g_vertex_b_neighbors?.length).toBe(0);
});

test("find edge by vertices in undirected graph", () => {
  const g = graph();

  const vertex_a = "A";
  const vertex_b = "B";
  const vertex_c = "C";

  g.add_edge(vertex_a, vertex_b);
  g.add_vertex(vertex_c);

  // non existent
  expect(g.find_edge(vertex_a, vertex_c)).toBeFalsy();
  expect(g.find_edge(vertex_c, vertex_a)).toBeFalsy();

  // from a <-> b - undirected
  expect(g.find_edge(vertex_a, vertex_b)).toBeTruthy();
  expect(g.find_edge(vertex_b, vertex_a)).toBeTruthy();
  // expect(g_edge_ab.weight).toBe(10);
});

test("find edge by vertices in directed graph", () => {
  const g = graph(true);

  const vertex_a = "A";
  const vertex_b = "B";
  const vertex_c = "C";

  g.add_edge(vertex_a, vertex_b);
  g.add_vertex(vertex_c);

  // non existent
  expect(g.find_edge(vertex_a, vertex_c)).toBeFalsy();
  expect(g.find_edge(vertex_c, vertex_a)).toBeFalsy();

  // only from a -> b - directed
  expect(g.find_edge(vertex_a, vertex_b)).toBeTruthy();
  expect(g.find_edge(vertex_b, vertex_a)).toBeFalsy();
  // expect(g_edge_ab.weight).toBe(10);
});

test("return vertex neighbors", () => {
  const g = graph(true);

  const vertex_a = "A";
  const vertex_b = "B";
  const vertex_c = "C";

  g.add_edge(vertex_a, vertex_b).add_edge(vertex_a, vertex_c);

  const neighbors = g.get_neighbors(vertex_a);

  expect(neighbors?.length).toBe(2);
  expect(neighbors?.[0]).toEqual(vertex_b);
  expect(neighbors?.[1]).toEqual(vertex_c);
});

test("return edges of undirected graph", () => {
  const g = graph();

  const vertex_a = "A";
  const vertex_b = "B";
  const vertex_c = "C";

  g.add_edge(vertex_a, vertex_b).add_edge(vertex_a, vertex_c);

  const edges = g.get_edges();

  expect(edges?.length).toBe(4);
  expect(edges?.[0]).toEqual([vertex_a, vertex_b]);
  expect(edges?.[1]).toEqual([vertex_a, vertex_c]);
  expect(edges?.[2]).toEqual([vertex_b, vertex_a]);
  expect(edges?.[3]).toEqual([vertex_c, vertex_a]);
});

test("return edges of directed graph", () => {
  const g = graph(true);

  const vertex_a = "A";
  const vertex_b = "B";
  const vertex_c = "C";

  g.add_edge(vertex_a, vertex_b).add_edge(vertex_a, vertex_c);

  const edges = g.get_edges();

  expect(edges?.length).toBe(2);
  expect(edges?.[0]).toEqual([vertex_a, vertex_b]);
  expect(edges?.[1]).toEqual([vertex_a, vertex_c]);
});

test("throw an error when trying to add edge twice", () => {
  function addSameEdgeTwice() {
    const g = graph(true);

    const vertex_a = "A";
    const vertex_b = "B";

    g.add_edge(vertex_a, vertex_b).add_edge(vertex_a, vertex_b);
  }

  expect(addSameEdgeTwice).toThrow();
});

test("possible to delete edges from graph", () => {
  const g = graph();

  const vertex_a = "A";
  const vertex_b = "B";
  const vertex_c = "C";

  g.add_edge(vertex_a, vertex_b)
    .add_edge(vertex_b, vertex_c)
    .add_edge(vertex_a, vertex_c);

  // expect(graph.getAllEdges().length).toBe(3);

  g.delete_edge(vertex_a, vertex_b);
  expect(g.has_edge(vertex_a, vertex_b)).toBeFalsy();

  // expect(graph.getAllEdges().length).toBe(2);
  // expect(graph.getAllEdges()[0].getKey()).toBe(edgeBC.getKey());
  // expect(graph.getAllEdges()[1].getKey()).toBe(edgeAC.getKey());
});

test("throw an error when trying to delete not existing edge", () => {
  function deleteNotExistingEdge() {
    const g = graph();

    const vertex_a = "A";
    const vertex_b = "B";
    const vertex_c = "C";

    g.add_edge(vertex_a, vertex_b);
    g.delete_edge(vertex_a, vertex_c);
  }

  expect(deleteNotExistingEdge).toThrowError();
});
