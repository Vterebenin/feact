class FeactDOMComponent {
    constructor(element) {
          this._currentElement = element;
    }

    mountComponent(container) {
          const domElement = document.createElement(this._currentElement.type);
          const textNode = document.createTextNode(this._currentElement.props.children);

          domElement.appendChild(textNode);
          container.appendChild(domElement);
    }
}
const TopLevelWrapper = function(props) {
    this.props = props;
};

TopLevelWrapper.prototype.render = function() {
    return this.props;
};


const Feact = {

    createElement(type, props, children) {
        const element = {
            type,
            props: props || {}
        };

        if (children) {
            element.props.children = children;
        }

        return element;
    },

    createClass(spec) {
        function Constructor(props) {
            this.props = props;
        }

        Constructor.prototype.render = spec.render;

        return Constructor;
    },

    render(element, container) {
        const wrapperElement =
            this.createElement(TopLevelWrapper, element);

        const componentInstance =
            new FeactCompositeComponentWrapper(wrapperElement);

        return componentInstance.mountComponent(container);
    }
}

class FeactCompositeComponentWrapper {
    constructor(element) {
        this._currentElement = element;
    }

    mountComponent(container) {
        const Component = this._currentElement.type;
        const componentInstance =
            new Component(this._currentElement.props);
        let element = componentInstance.render();

        while (typeof element.type === 'function') {
            element = (new element.type(element.props)).render();
        }

        const domComponentInstance = new FeactDOMComponent(element);
        domComponentInstance.mountComponent(container);
    }
}

const MyMessage = Feact.createClass({
    render() {
        if (this.props.asTitle) {
            return Feact.createElement(MyTitle, {
                message: this.props.message
            });
        } else {
            return Feact.createElement('p', null, this.props.message);
        }
    }
})

const MyTitle = Feact.createClass({
    render() {
        return Feact.createElement('h1', null, this.props.message);
    }
})

Feact.render(
    Feact.createElement(MyTitle, { message: 'hey there, ueba' }),
    document.getElementById('root')
)

Feact.render(
    Feact.createElement(MyMessage, { asTitle: true, message: 'this is an h1 message' }),
  document.getElementById('root')
);

Feact.render(
    Feact.createElement(MyMessage, { asTitle: false, message: 'and this is just a paragraph' }),
  document.getElementById('root')
);

Feact.render(
    Feact.createElement('button', null, 'i\'m a primitive element'),
document.getElementById('root')
);

