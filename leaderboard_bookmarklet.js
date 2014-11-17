(function() {
	var t=$('.leaderboard-table tbody')[0];
	var tbody = $(t);
	tbody.on('DOMSubtreeModified', function() {
		console.dir(arguments);
		tbody.append('<tr><td></td><td>L1NT</td><td>test</td></tr>');
	});
	console.log('Leaderboard behavior improved by L1NT!');
})();


javascript:(function() {
	$('#message-input').val('@mcsnolte: can a get a fresh develop to test deployment? thanks');
	$('#message-form').submit();
});
