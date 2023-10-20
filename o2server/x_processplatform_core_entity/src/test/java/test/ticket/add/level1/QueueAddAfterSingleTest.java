package test.ticket.add.level1;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import com.google.gson.Gson;
import com.x.processplatform.core.entity.ticket.Ticket;
import com.x.processplatform.core.entity.ticket.Tickets;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class QueueAddAfterSingleTest {

	private static Gson gson = new Gson();

	@DisplayName("A后加签EFG,FEG任意处理")
	@Test
	@Order(1)
	void test01() {
		List<Ticket> p1 = Arrays.asList("A${LA}", "B${LB}", "C${LC}").stream().map(Ticket::new)
				.collect(Collectors.toList());
		List<String> p2 = Arrays.asList("E${LE}", "F${LF}", "G${LG}");
		List<String> p3 = Arrays.asList("I${LI}", "J${LJ}", "K${LK}");
		Tickets tickets = Tickets.queue(p1);
		String value = tickets.bubble().stream().<String>map(Ticket::distinguishedName)
				.collect(Collectors.joining(","));
		Assertions.assertEquals("A", value);
		Optional<Ticket> opt = tickets.findTicketWithLabel("LA");
		tickets.add(opt.get(), p2, false, Tickets.MODE_SINGLE);
		value = tickets.bubble().stream().<String>map(Ticket::distinguishedName).collect(Collectors.joining(","));
		Assertions.assertEquals("E,F,G", value);
		tickets.completed("LF");
		value = tickets.bubble().stream().<String>map(Ticket::distinguishedName).collect(Collectors.joining(","));
		Assertions.assertEquals("B", value);
		tickets.completed("LB");
		value = tickets.bubble().stream().<String>map(Ticket::distinguishedName).collect(Collectors.joining(","));
		Assertions.assertEquals("C", value);
		tickets.completed("LC");
		value = tickets.bubble().stream().<String>map(Ticket::distinguishedName).collect(Collectors.joining(","));
		Assertions.assertEquals("", value);
	}

}
