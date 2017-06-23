$(function() {
	$(".comment").click(function(e) {
		var target = $(this)
		console.log(target)
		var toid = target.data("tid")
		var commentId = target.data("cid")
		if ($("#toId").length > 0) {
			$("#toId").val(toid);
		}else {
			$("<input>").attr({
				type:"hidden",
				name : "comment[tid]",
				id: 'toId',
				value: toid,
			}).appendTo("#commentForm")	
		}
		
		if ($("#commentId").length > 0) {
			$("#commentId").val(commentId);
		}else {
			$("<input>").attr({
				type:"hidden",
				name : "comment[cid]",
				id: 'commentId',
				value: commentId,
			}).appendTo("#commentForm")
		}
		
	})
})