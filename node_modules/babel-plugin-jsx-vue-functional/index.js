module.exports = babel => {
  const t = babel.types

  return {
    inherits: require('babel-plugin-syntax-jsx'),
    visitor: {
      Program (path) {
        path.traverse({
          'VariableDeclaration' (path) {
            if (path.node.declarations.length !== 1 ||
              !t.isVariableDeclarator(path.node.declarations[0]) ||
              !t.isArrowFunctionExpression(path.node.declarations[0].init)) {
              return
            }
            const jsxChecker = {
              hasJsx: false
            }
            path.traverse({
              JSXElement () {
                this.hasJsx = true
              }
            }, jsxChecker)
            if (!jsxChecker.hasJsx) {
              return
            }
            const name = path.node.declarations[0].id.name
            const params = [t.identifier('h'), ...path.node.declarations[0].init.params]
            const body = path.node.declarations[0].init.body
            const isDevEnv = process.env.NODE_ENV === 'development'
            const props = [
              t.objectProperty(
                t.identifier('functional'),
                t.booleanLiteral(true)
              ),
              t.objectProperty(
                t.identifier('render'),
                t.arrowFunctionExpression(params, body)
              )
            ]
            if (isDevEnv) {
              props.unshift(
                t.objectProperty(
                  t.identifier('name'),
                  t.stringLiteral(name)
                )
              )
            }
            path.replaceWith(
              t.variableDeclaration(
                'const',
                [
                  t.variableDeclarator(
                    t.identifier(name),
                    t.objectExpression(
                      props
                    )
                  )
                ]
              ),
              []
            )
          }
        })
      }
    }
  }
}
