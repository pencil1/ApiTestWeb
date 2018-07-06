import test from 'ava'
import { transform } from 'babel-core'

const transpile = src => {
  return transform(src, {
    plugins: './index'
  }).code.trim()
}

test('Generic functional export', t => {
  t.is(
    transpile(`export const a = ({ props, listeners }) => <div onClick={listeners.click}>{props.msg}</div>`),
    `export const a = {
  functional: true,
  render: (h, { props, listeners }) => <div onClick={listeners.click}>{props.msg}</div>
};`
  )
})

test('Generic functional component', t => {
  t.is(
    transpile(`const a = ({ props, listeners }) => <div onClick={listeners.click}>{props.msg}</div>`),
    `const a = {
  functional: true,
  render: (h, { props, listeners }) => <div onClick={listeners.click}>{props.msg}</div>
};`
  )
})

test('Generic functional export with "name" when NODE_ENV === "development"', t => {
  const nodeEnv = process.env.NODE_ENV
  process.env.NODE_ENV = 'development'
  t.is(
    transpile(`export const a = ({ props, listeners }) => <div onClick={listeners.click}>{props.msg}</div>`),
    `export const a = {
  name: "a",
  functional: true,
  render: (h, { props, listeners }) => <div onClick={listeners.click}>{props.msg}</div>
};`
  )
  process.env.NODE_ENV = nodeEnv
})

test('Generic functional component with "name" when NODE_ENV === "development"', t => {
  const nodeEnv = process.env.NODE_ENV
  process.env.NODE_ENV = 'development'
  t.is(
    transpile(`const a = ({ props, listeners }) => <div onClick={listeners.click}>{props.msg}</div>`),
    `const a = {
  name: "a",
  functional: true,
  render: (h, { props, listeners }) => <div onClick={listeners.click}>{props.msg}</div>
};`
  )
  process.env.NODE_ENV = nodeEnv
})
