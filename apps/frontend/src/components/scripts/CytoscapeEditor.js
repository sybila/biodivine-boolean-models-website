import cytoscape from 'cytoscape';

export let EdgeMonotonicity = {
    unspecified: 'unspecified',
    activation: 'activation',
    inhibition: 'inhibition',
};

/*
	Responsible for managing the cytoscape editor object. It has its own representation of the graph,
	but it should never be updated directly. Instead, always use LiveModel to specify updates.
*/
export let CytoscapeEditor = {
    // Reference to the cytoscape library "god object"
    _cytoscape: undefined,

    init: function (container) {
        this._cytoscape = cytoscape(this.initOptions(container));
    },

    layoutCose() {
        this._cytoscape
            .layout({
                name: 'cose',
                padding: 250,
                animate: false,
                nodeRepulsion: function (node) {
                    return 100000;
                },
                refresh: 20,
                fit: true,
                nodeDimensionsIncludeLabels: true,
            })
            .start();
    },

    // Return an id of the selected node, or undefined if nothing is selected.
    getSelectedNodeId() {
        let node = CytoscapeEditor._cytoscape.nodes(':selected');
        if (node.length === 0) return undefined; // nothing selected
        return node.id();
    },

    // Add a new node to the graph at the given position.
    // (Int, String, [Num, Num])
    addNode(id, name, position = [0, 0]) {
        let node = this._cytoscape.add({
            data: { id: id, name: name },
            position: { x: position[0], y: position[1] },
        });
        node.on('mouseover', (e) => {
            node.addClass('hover');
        });
        node.on('mouseout', (e) => {
            node.removeClass('hover');
        });
    },

    // Set the given node as selected.
    selectNode(id) {
        let selected = CytoscapeEditor._cytoscape.$(':selected'); // node or edge that are selected
        if (selected.length === 1) {
            selected.unselect();
        }
        let node = this._cytoscape.getElementById(id);
        if (node !== undefined) {
            node.select();
        }
    },

    // Remove the node with the given ID from the graph.
    removeNode(id) {
        let node = this._cytoscape.getElementById(id);
        if (node !== undefined) {
            if (node.selected()) node.unselect(); // ensure menu is hidden, etc.
            this._cytoscape.remove(node);
        } else {
            console.log('[CytoscapeEditor] Cannot remove ' + id + ' - node not found.');
        }
    },

    // Change name of the node to the given value.
    renameNode(id, newName) {
        let node = this._cytoscape.getElementById(id);
        if (node !== undefined) {
            let data = node.data();
            data['name'] = newName;
            this._cytoscape.style().update(); //redraw graph
        }
    },

    // Allow to externally set which node is hovered - make sure to unset it as well.
    hoverNode(id, isHover) {
        let node = this._cytoscape.getElementById(id);
        if (isHover) {
            node.addClass('hover');
        } else {
            node.removeClass('hover');
        }
    },

    // Allow to externally set which edge is hovered - just make sure to unset it later.
    hoverEdge(regulatorId, targetId, isHover) {
        let edge = this._findRegulationEdge(regulatorId, targetId);
        if (edge !== undefined) {
            if (isHover) {
                edge.addClass('hover');
            } else {
                edge.removeClass('hover');
            }
        }
    },

    // Zoom and pan the editor to ensure that given node is visible.
    showNode(id) {
        let node = this._cytoscape.getElementById(id);
        if (node !== undefined) {
            // Taken from https://github.com/cytoscape/cytoscape.js/issues/1691
            let zoom = 1.1;
            let bb = node.boundingBox();
            let w = this._cytoscape.width();
            let h = this._cytoscape.height();
            let pan = {
                // add some random padding so it does not end up under the editor panel
                x: (w - zoom * (bb.x1 + bb.x2)) / 2 + 250,
                y: (h - zoom * (bb.y1 + bb.y2)) / 2,
            };

            this._cytoscape.animate({
                zoom: 1.1,
                pan: pan,
            });
        }
    },

    // Return a { regulator, target } object that describes currently selected regulation,
    // or undefined if nothing is selected.
    getSelectedRegulationPair() {
        let edge = CytoscapeEditor._cytoscape.edges(':selected');
        if (edge.length === 0) return undefined; // nothing selected
        return { regulator: edge.data().source, target: edge.data().target };
    },

    // Ensure that the graph contains edge which corresponds to the provided regulation.
    ensureRegulation(regulation) {
        let currentEdge = this._findRegulationEdge(regulation.regulator, regulation.target);
        if (currentEdge !== undefined) {
            // Edge exists - just make sure to update data
            let data = currentEdge.data();
            data.observable = regulation.observable;
            data.monotonicity = regulation.monotonicity;
            this._cytoscape.style().update(); //redraw graph
            if (currentEdge.selected()) {
                // if the edge is selected, we also redraw the edge menu
                this._renderMenuForSelectedEdge(currentEdge);
            }
        } else {
            // Edge does not exist - create a new one
            let edge = this._cytoscape.add({
                group: 'edges',
                data: {
                    source: regulation.regulator,
                    target: regulation.target,
                    observable: regulation.observable,
                    monotonicity: regulation.monotonicity,
                },
            });
            this._initEdge(edge);
        }
    },

    // Remove regulation between the two specified nodes.
    removeRegulation(regulatorId, targetId) {
        let edge = this._findRegulationEdge(regulatorId, targetId);
        if (edge !== undefined) {
            if (edge.selected()) edge.unselect();
            this._cytoscape.remove(edge);
        }
    },

    // Pan and zoom the graph to show the whole model.
    fit() {
        this._cytoscape.fit();
        // We zoom around the center position where nodes actually are
        let x = 0;
        let y = 0;
        let count = 0;
        this._cytoscape.nodes().forEach((node) => {
            let position = node.position();
            x += position.x;
            y += position.y;
            count += 1;
        });
        // zoom out a bit to have some padding
        this._cytoscape.zoom({
            level: this._cytoscape.zoom() * 0.8,
            position: { x: x / count, y: y / count },
        });
    },

    // Get the position of the node with the given id, or undefined if the node does not exist.
    getNodePosition(id) {
        let node = this._cytoscape.getElementById(id);
        if (node !== undefined) {
            let position = node.position();
            return [position.x, position.y];
        }
        return undefined;
    },

    // Return the edge which represents regulation between the given pair of variables or undefined
    // if such edge does not exist.
    _findRegulationEdge(regulatorId, targetId) {
        let edge = this._cytoscape.edges('[source = "' + regulatorId + '"][target = "' + targetId + '"]');
        if (edge.length === 1) {
            return edge[0];
        } else {
            return undefined;
        }
    },

    // Helper function to initialize new edge object, since edges can appear explicitly
    // or from the edge handle's plugin.
    _initEdge(edge) {
        edge.on('mouseover', (e) => {
            edge.addClass('hover');
        });
        edge.on('mouseout', (e) => {
            edge.removeClass('hover');
        });
    },

    initOptions: function (container) {
        return {
            container: container,
            // Some sensible default auto-layout algorithm
            layout: {
                animate: false,
                animationDuration: 300,
                animationThreshold: 250,
                refresh: 20,
                fit: true,
                name: 'cose',
                padding: 250,
                nodeRepulsion: function (node) {
                    return 100000;
                },
                nodeDimensionsIncludeLabels: true,
            },
            boxSelectionEnabled: false,
            selectionType: 'single',
            style: [
                {
                    // Style of the graph nodes
                    selector: 'node[name]',
                    style: {
                        //
                        label: 'data(name)',
                        // put label in the middle of the node (vertically)
                        'text-valign': 'center',
                        width: 'label',
                        height: 'label',
                        // a rectangle with slightly sloped edges
                        shape: 'round-rectangle',
                        // when selecting, do not display any overlay
                        'overlay-opacity': 0,
                        // other visual styles
                        padding: 12,
                        'background-color': '#dddddd',
                        'font-family': 'FiraMono',
                        'font-size': '12pt',
                        'border-width': '1px',
                        'border-color': '#bbbbbb',
                        'border-style': 'solid',
                    },
                },
                {
                    // When a node is highlighted by mouse, show it with a dashed blue border.
                    selector: 'node.hover',
                    style: {
                        'border-width': '2.0px',
                        'border-color': '#6a7ea5',
                        'border-style': 'dashed',
                    },
                },
                {
                    // When a node is selected, show it with a thick blue border.
                    selector: 'node:selected',
                    style: {
                        'border-width': '2.0px',
                        'border-color': '#6a7ea5',
                        'border-style': 'solid',
                    },
                },
                {
                    // General style of the graph edge
                    selector: 'edge',
                    style: {
                        width: 3.0,
                        'curve-style': 'bezier',
                        'loop-direction': '-15deg',
                        'loop-sweep': '30deg',
                        'text-outline-width': 2.3,
                        'text-outline-color': '#cacaca',
                        'font-family': 'FiraMono',
                    },
                },
                {
                    selector: 'edge.hover',
                    style: { 'overlay-opacity': 0.1 },
                },
                {
                    // Show non-observable edges as dashed
                    selector: 'edge[observable]',
                    style: {
                        'line-style': (edge) => {
                            if (edge.data().observable) {
                                return 'solid';
                            } else {
                                return 'dashed';
                            }
                        },
                        'line-dash-pattern': [8, 3],
                    },
                },
                {
                    // When the edge is an activation, show it as green with normal arrow
                    selector: 'edge[monotonicity="activation"]',
                    style: {
                        'line-color': '#4abd73',
                        'target-arrow-color': '#4abd73',
                        'target-arrow-shape': 'triangle',
                    },
                },
                {
                    // When the edge is an inhibition, show it as red with a `tee` arrow
                    selector: 'edge[monotonicity="inhibition"]',
                    style: {
                        'line-color': '#d05d5d',
                        'target-arrow-color': '#d05d5d',
                        'target-arrow-shape': 'tee',
                    },
                },
                {
                    // When the edge has unspecified monotonicity, show it as grey with normal arrow
                    selector: 'edge[monotonicity="unspecified"]',
                    style: {
                        'line-color': '#797979',
                        'target-arrow-color': '#797979',
                        'target-arrow-shape': 'triangle',
                    },
                },
                {
                    // A selected edge should be drawn with an overlay
                    selector: 'edge:selected',
                    style: {
                        'overlay-opacity': 0.1,
                    },
                },
            ],
        };
    },
};
