package tests;

import static helper.SeleniumHelper.Root;
import org.junit.Test;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;

public class LoadTests extends BaseMindMapsTestCase {

	@Test
	public void testCreate250Nodes() {
		createNodes(250);
		assertEquals(250 + 1, getNodeCount());
	}

	protected void createNodes(int num) {
		while (num > 0) {
			selenium.mouseDown(Root().text().get());
			clickCreateNodeButton();
			num--;
			clickCreateNodeButton();
			num--;
			clickCreateNodeButton();
			num--;
		}
	}
	
	protected void doUndoActions(int num) {
		while (num > 0) {
			clickUndoButton();
			num--;
		}
	}

	@Test
	public void test50UndoActions() {
		createNodes(60);
		doUndoActions(50);
		assertEquals(10 + 1, getNodeCount());
		assertFalse(selenium.isElementPresent("css=#button-UNDO_COMMAND.ui-state-disabled"));
	}
}
