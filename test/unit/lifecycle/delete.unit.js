const test = require('tap').test
const server = require('../../utils/server').startPlainArrow().server
const connector = require('../../utils/server').startPlainArrow().connector
const deleteMethod = require('../../../lib/methods/delete')['delete']
const twilioAPI = require('../../../utils/twilioAPI')(connector.config)
const sinon = require('sinon')
connector.twilioAPI = twilioAPI

test('### Delete Call - Error Case ###', function (t) {
  const Model = server.getModel('call')

  const errorMessage = 'Deletion error'
  function cbError (errorMessage) { }
  const cbErrorSpy = sinon.spy(cbError)

  const twilioAPIStubError = sinon.stub(
    twilioAPI,
    'deleteById',
    (Model, id, callback) => {
      callback(errorMessage)
    }
  )

  deleteMethod.bind(connector, Model, '', cbErrorSpy)()
  t.ok(twilioAPIStubError.calledOnce)
  t.ok(cbErrorSpy.calledOnce)
  t.ok(cbErrorSpy.calledWith(errorMessage))

  twilioAPIStubError.restore()
  t.end()
})

test('### Delete Call - Ok Case ###', function (t) {
  connector.twilioAPI = twilioAPI

  const Model = server.getModel('call')
  const data = 'TestData'
  function cbOk (errorMessage, data) { }
  const cbOkSpy = sinon.spy(cbOk)

  const twilioAPIStubOk = sinon.stub(
    twilioAPI,
    'deleteById',
    (Model, id, callback) => {
      callback(null, data)
    }
  )

  deleteMethod.bind(connector, Model, '', cbOkSpy)()
  t.ok(twilioAPIStubOk.calledOnce)
  t.ok(cbOkSpy.calledOnce)
  t.ok(cbOkSpy.calledWith(null, data))

  twilioAPIStubOk.restore()
  t.end()
})
