(function() {

	$(document).ready(function() {

		var lock = false;
		var rolling = false;
		var lastTimestamp = null;
		var intervalId = null;
		var timeoutId = null;

		setInterval(function() {
			$.post( "get.php", {}, function(result) {
				console.log(result);

				if(result.rolling && !rolling) {
					lock = true;
					rolling = true;

					$('#resultText .in').text('');
					clearTimeout(timeoutId);

					$('#dice').removeClass('rolled').addClass('rolling');

					if(result.plusNumber > 0) {
						$('#inputPlus').val('+' + result.plusNumber);
					} else {
						$('#inputPlus').val('');
					}
					if(result.minusNumber > 0) {
						$('#inputMinus').val('−'+result.minusNumber);
					} else {
						$('#inputMinus').val('');
					}

					intervalId = setInterval(function() {
						var newNumber = Math.floor(Math.random() * 20 + 1);
						$('#dice .in').text(newNumber);
					}, 100);

					return;
				}

				if(result.update && result.rolled && result.timestamp != lastTimestamp) {

					$('#dice').removeClass('rolling').addClass('rolled');

					lastTimestamp = result.timestamp;

					if(result.plusNumber > 0) {
						$('#inputPlus').val('+' + result.plusNumber);
					} else {
						$('#inputPlus').val('');
					}
					if(result.minusNumber > 0) {
						$('#inputMinus').val('−'+result.minusNumber);
					} else {
						$('#inputMinus').val('');
					}

					changedInputs = false;

					setTimeout(function() {
						lock = false;
						rolling = false;
						clearInterval(intervalId);
						$('#dice .in').text(result.newNumber);
						$('#resultText .in').text(result.newNumber - result.minusNumber + result.plusNumber);
					}, 1000);

					timeoutId = setTimeout(function() {
						$('#dice .in').text('');
						$('#resultText .in').text('');

						if(!changedInputs) {
							$('#inputPlus').val('');
							$('#inputMinus').val('');
						}
					}, 20000);
				}

			}, 'json');

		}, 1000);

		var changedInputs = false;
		$('#inputPlus, #inputMinus').change(function() {
			changedInputs = true;
		});

		$('#rollButton').click(function(){
			if(lock) {
				return;
			}
			lock = true;

			$('#resultText .in').text('');
			clearTimeout(timeoutId);

			var newNumber = Math.floor(Math.random() * 20 + 1);

			var minusNumber = $('#inputMinus').val();
			var plusNumber = $('#inputPlus').val();

			console.log(newNumber, minusNumber, plusNumber);

			minusNumber = parseInt(minusNumber.replace(/[^0-9]/g, ''));
			plusNumber = parseInt(plusNumber.replace(/[^0-9]/g, ''));

			if(!minusNumber) {
				minusNumber = 0;
			}
			if(!plusNumber) {
				plusNumber = 0;
			}

			console.log(newNumber, minusNumber, plusNumber);

			$.post( "save.php", {rolling: true, rolled: false, newNumber: newNumber, minusNumber: minusNumber, plusNumber: plusNumber}, function(result) {

				console.log('rolling sent');

				setTimeout(function() {

					$.post( "save.php", {rolling: false, rolled: true, newNumber: newNumber, minusNumber: minusNumber, plusNumber: plusNumber}, function(result) {
						console.log('update sent');
					});

				}, 3000);
			});


		});

		$('.input').focus(function(e) {
			$(e.currentTarget).select();
		});

		$('#inputPlus').keyup(function(e) {
			var obj = $(e.currentTarget);
			var val = Math.abs(obj.val().replace(/[^0-9]/g, ''));
			if(val > 0) {
				obj.val('+'+val);
			} else {
				obj.val('');
			}
		})
		$('#inputMinus').keyup(function(e) {
			var obj = $(e.currentTarget);
			var val = Math.abs(obj.val().replace(/[^0-9]/g, ''));
			if(val > 0) {
				obj.val('−'+val);
			} else {
				obj.val('');
			}
		});

	});

})();