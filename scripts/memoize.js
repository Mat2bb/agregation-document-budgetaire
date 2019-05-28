import fastMemoize from 'fast-memoize'

// fast-memoize uses JSON.stringify(arguments) as default serializer
// It doesn't work well with Set/Map/WeakSet/WeakMap which always serialize to '{}'

function Serializer(){
    const objectCounter = new WeakMap()
    let next = 1;

    return function(...args){
        return args.map(arg => {
            if(arg === null || arg === undefined || typeof arg === 'boolean'){
                return String(arg)
            }

            switch(typeof arg){
                case 'number':
                case 'string': {
                    return `${typeof arg}(${arg})`
                }
                case 'object': // null handled above
                case 'symbol': {
                    let id = objectCounter.get(arg);
                    if(id === undefined){
                        id = next;
                        objectCounter.set(arg, id)
                        next++
                    }
                    return id;
                }
                default: {
                    console.error('Unhandled type', typeof arg)
                    return 'Ser'+Math.random().toString(36).slice(2)
                }
            }
        }).join(' ')
    }
}

export default function memoize(fn){
    return fastMemoize(fn, {serializer: new Serializer()})
}
