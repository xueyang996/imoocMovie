var crypto = require('crypto');
var bcrypt = require('bcrypt');

function getRandomString(len) {
	if (!len) {
		len = 16
	}
	crypto.randomBytes(Math.ceil(len/2), function(err, buf) {
		return buf.toString("hex");
	})
}

var should = require('should');
var app = require('../../app');
var mongoose = require('mongoose');
var User = require('../../app/models/user');

var userA

describe("<Unit test", function(){ 
	describe("Model user:", function() {
		before(function(done) {
			userA = {
				name: getRandomString(),
				password: "password"
			}
			done()
		})
		describe("before method save", function() {
			it("should begin without test user", function(done) {
				User.find({name: userA.name}, function(err, users) {
					users.should.have.length(0)
					done()
				})
			})
		})

		describe("user save", function() {
			it("should save without problems", function(done) {
				var _user = new User(userA)

				_user.save(function(err) {
					should.not.exist(err)

					_user.remove(function(err) {
						should.not.exist(err)	
						done()				
					})
				})
			})

			it("should password be hashed correctly", function(done) {
				var _user = new User(userA)
				var pwd = userA.password

				_user.save(function(err) {
					should.not.exist(err)
					_user.password.should.not.have.length(0)
					bcrypt.compare(pwd, _user.password, function(err, isMatch) {
						should.not.exist(err)
						isMatch.should.equal(true)
					})
					_user.remove(function(err) {
						should.not.exist(err)	
						done()				
					})
				})
			})

			it("should fail to save an existing user", function(done) {
				var _user1 = new User(userA)
				_user1.save(function(err) {
					var _user2 = new User(userA)
					_user2.save(function(err) {
						should.exist(err)
						_user1.remove(function(err) {
							_user2.remove(function(err) {
								done()
							})
						})
					})	
				})
				
			})
		})
	})
	
})